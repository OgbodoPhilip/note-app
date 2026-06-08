"use client";

import Navbar from "@/components/Navbar";
import RateLimitedUI from "@/components/RateLimitedUI";
import { formatDate } from "@/lib/utils";
import axios, { AxiosResponse } from "axios";
import { PenSquareIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:5000";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function Center() {
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async (): Promise<void> => {
      try {
        const res: AxiosResponse<Note[]> = await axios.get<Note[]>(
          `${API_URL}/api/notes`,
        );
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error: unknown) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 429) {
            setIsRateLimited(true);
            toast.error(
              "You have made too many requests. Please try again later.",
            );
          } else {
            toast.error(
              typeof error.response?.data?.message === "string"
                ? error.response.data.message
                : "An error occurred while fetching notes.",
            );
          }
        } else {
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleDelete = async (): Promise<void> => {
    if (!confirmId) return;
    const id = confirmId;
    setConfirmId(null);

    try {
      setDeletingId(id);
      await axios.delete(`${API_URL}/api/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted successfully");
    } catch (error: unknown) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(
          typeof error.response?.data?.message === "string"
            ? error.response.data.message
            : "Failed to delete note",
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (isRateLimited) {
    return <RateLimitedUI />;
  }

  return (
    <div className="min-h-screen p-4">
      <Navbar />

      {loading && (
        <div className="flex justify-center items-center mt-10">
          <p className="text-lg font-bold">Loading Notes...</p>
        </div>
      )}

      {!loading && notes.length === 0 && (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-bold mb-4">No Notes Found</h2>
          <p className="text-gray-600 mb-6">
            You have not created any notes yet. Start by creating your first
            note!
          </p>
          <Link href="/create" className="btn btn-primary">
            Create Note
          </Link>
        </div>
      )}

      {!loading && notes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="card-body">
                <h3 className="card-title">{note.title}</h3>
                <p className="text-base-content/70 line-clamp-4">
                  {note.content}
                </p>
                <div className="card-actions justify-between items-center mt-4">
                  <span className="text-sm text-base-content/60">
                    Created: {formatDate(new Date(note.createdAt))}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/notedetails/${note._id}`}
                      className="btn btn-sm btn-ghost"
                    >
                      <PenSquareIcon className="size-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmId(note._id)}
                      disabled={deletingId === note._id}
                      className="btn btn-sm btn-ghost text-error"
                    >
                      {deletingId === note._id ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <Trash2Icon className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmId && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Note</h3>
            <p className="py-4">
              Are you sure you want to delete this note? This action cannot be
              undone once deleted.
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setConfirmId(null)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setConfirmId(null)} />
        </dialog>
      )}
    </div>
  );
}
