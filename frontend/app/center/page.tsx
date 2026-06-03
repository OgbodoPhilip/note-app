"use client";

import Navbar from "@/components/Navbar";
import RateLimitedUI from "@/components/RateLimitedUI";
import { formatDate } from "@/lib/utils";
import axios, { AxiosResponse } from "axios";
import { PenSquareIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

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

  useEffect(() => {
    const fetchNotes = async (): Promise<void> => {
      try {
        const res: AxiosResponse<Note[]> = await axios.get<Note[]>(
          "http://localhost:5000/api/notes",
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
              error.response?.data?.message ??
                "An error occurred while fetching notes.",
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
                      href={`/edit/${note._id}`}
                      className="btn btn-sm btn-ghost"
                    >
                      <PenSquareIcon className="size-4" />
                    </Link>

                    <button
                      type="button"
                      className="btn btn-sm btn-ghost text-error"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
