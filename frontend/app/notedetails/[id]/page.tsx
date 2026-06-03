"use client";

import Navbar from "@/components/Navbar";
import axios from "axios";
import {
  ArrowLeftIcon,
  CheckIcon,
  FileTextIcon,
  Loader2Icon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:5000";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type SaveStatus = "idle" | "saving" | "saved";

export default function NoteDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [notFound, setNotFound] = useState<boolean>(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestTitle = useRef(title);
  const latestContent = useRef(content);

  // Lock the page height to the initial viewport so the soft keyboard
  // shrinking the window does not squash the layout.
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty(
        "--initial-vh",
        `${window.innerHeight}px`,
      );
    };
    setVh();
    // Re-set only on resize events that are NOT caused by the keyboard
    // (i.e. orientation changes). We intentionally do NOT re-set on every
    // resize so the keyboard pop does not collapse the layout.
    window.addEventListener("orientationchange", setVh);
    return () => window.removeEventListener("orientationchange", setVh);
  }, []);

  useEffect(() => {
    latestTitle.current = title;
    latestContent.current = content;
  }, [title, content]);

  useEffect(() => {
    const fetchNote = async (): Promise<void> => {
      try {
        const res = await axios.get<Note>(`${API_URL}/api/notes/${id}`);
        setNote(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error("Failed to load note.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNote();
  }, [id]);

  const saveNote = useCallback(async (): Promise<void> => {
    const currentTitle = latestTitle.current.trim();
    const currentContent = latestContent.current.trim();
    if (!currentTitle && !currentContent) return;

    try {
      setSaveStatus("saving");
      await axios.put(`${API_URL}/api/notes/${id}`, {
        title: currentTitle,
        content: currentContent,
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (error: unknown) {
      setSaveStatus("idle");
      if (axios.isAxiosError(error)) {
        toast.error(
          typeof error.response?.data?.message === "string"
            ? error.response.data.message
            : "Failed to save note.",
        );
      } else {
        toast.error("Something went wrong.");
      }
    }
  }, [id]);

  const triggerAutoSave = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => saveNote(), 1000);
  }, [saveNote]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    triggerAutoSave();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    triggerAutoSave();
  };

  const handleSaveAndGoBack = async (): Promise<void> => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    await saveNote();
    router.push("/");
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Shared page shell for loading / not-found states
  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div
      className="bg-base-200 flex flex-col overflow-hidden"
      style={{ height: "var(--initial-vh, 100dvh)" }}
    >
      <div className="flex-none px-4 pt-4">
        <Navbar />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4">
        {children}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-base-content/40 text-xs tracking-widest uppercase">
          Loading note…
        </p>
      </div>
    );
  }

  if (notFound || !note) {
    return (
      <div>
        <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center">
          <FileTextIcon className="size-7 text-error/50" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-1">Note not found</h2>
          <p className="text-base-content/40 text-sm">
            This note may have been deleted or does not exist.
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm px-8"
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div
      className="bg-base-200 flex flex-col overflow-hidden"
      style={{ height: "var(--initial-vh, 100dvh)" }}
    >
      {/* Navbar */}
      <div className="flex-none px-4 pt-4">
        <Navbar />
      </div>

      {/* Page wrapper */}
      <div className="flex-1 flex flex-col min-h-0 max-w-3xl w-full mx-auto px-4 py-3 gap-3">
        {/* Top bar */}
        <div className="flex-none flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="btn btn-ghost btn-sm gap-1.5 text-base-content/50 hover:text-base-content"
          >
            <ArrowLeftIcon className="size-4" />
            <span className="hidden sm:inline text-sm">Back</span>
          </button>

          {/* Auto-save pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              saveStatus === "saving"
                ? "bg-warning/15 text-warning"
                : saveStatus === "saved"
                  ? "bg-success/15 text-success"
                  : "bg-base-content/5 text-base-content/25"
            }`}
          >
            {saveStatus === "saving" && (
              <Loader2Icon className="size-3 animate-spin" />
            )}
            {saveStatus === "saved" && <CheckIcon className="size-3" />}
            {saveStatus === "idle" && (
              <span className="size-1.5 rounded-full bg-current inline-block" />
            )}
            <span>
              {saveStatus === "saving"
                ? "Saving…"
                : saveStatus === "saved"
                  ? "All changes saved"
                  : "Auto-save on"}
            </span>
          </div>
        </div>

        {/* Editor card */}
        <div className="flex-1 min-h-0 bg-base-100 rounded-2xl shadow-lg overflow-hidden flex flex-col">
          {/* Accent bar */}
          <div className="flex-none h-[3px] w-full bg-gradient-to-r from-primary via-secondary to-accent" />

          <div className="flex-1 min-h-0 flex flex-col px-6 sm:px-8 pt-5 pb-4 gap-4">
            {/* Label */}
            <p className="flex-none text-[10px] font-semibold tracking-widest uppercase text-base-content/25">
              Edit note
            </p>

            {/* Title */}
            <div className="flex-none">
              <label className="block text-[11px] font-medium text-base-content/35 mb-1.5 tracking-wide">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Give your note a title…"
                className="w-full bg-base-200/50 hover:bg-base-200 focus:bg-base-200 rounded-xl px-4 py-3 text-lg font-bold placeholder:text-base-content/20 border-2 border-transparent focus:border-primary focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Content textarea — fills remaining space */}
            <div className="flex-1 min-h-0 flex flex-col">
              <label className="flex-none block text-[11px] font-medium text-base-content/35 mb-1.5 tracking-wide">
                Content
              </label>
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Write your thoughts here…"
                className="flex-1 min-h-0 w-full bg-base-200/50 hover:bg-base-200 focus:bg-base-200 rounded-xl px-4 py-3 text-sm leading-relaxed placeholder:text-base-content/20 border-2 border-transparent focus:border-primary focus:outline-none transition-all duration-200 resize-none"
              />
            </div>

            {/* Timestamps */}
            <div className="flex-none flex flex-wrap gap-x-5 gap-y-0.5 pt-3 border-t border-base-content/8">
              <span className="text-[11px] text-base-content/25">
                <span className="text-base-content/35 font-medium">
                  Created{" "}
                </span>
                {formatDate(note.createdAt)}
              </span>
              <span className="text-[11px] text-base-content/25">
                <span className="text-base-content/35 font-medium">
                  Updated{" "}
                </span>
                {formatDate(note.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="flex-none bg-base-100 rounded-2xl shadow-md px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-base-content/35 text-center sm:text-left">
            Changes are saved automatically as you type.
          </p>
          <button
            onClick={handleSaveAndGoBack}
            disabled={saveStatus === "saving"}
            className="btn btn-primary btn-sm w-full sm:w-auto px-8 gap-2 rounded-xl"
          >
            {saveStatus === "saving" ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                Saving…
              </>
            ) : (
              <>
                <CheckIcon className="size-4" />
                Save & return home
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
