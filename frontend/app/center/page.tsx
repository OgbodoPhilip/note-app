"use client";

import Navbar from "@/components/Navbar";
import RateLimitedUI from "@/components/RateLimitedUI";
import axios, { AxiosResponse } from "axios";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function Center(): JSX.Element {
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async (): Promise<void> => {
      try {
        const res: AxiosResponse<Note[]> = await axios.get<Note[]>(
          "http://localhost:5000/api/notes",
        );

        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error: unknown) {
        

        if (error.response?.status === 429) {
          setIsRateLimited(true);
          toast.error("You have made too many requests. Please try again later.");
        } else {
          toast.error("An error occurred while fetching notes.");
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
        <div className="flex justify-center mt-10">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      )}

      {!loading && notes.length === 0 && (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-bold mb-4">No Notes Found</h2>

          <p className="text-gray-600 mb-6">
            You have not created any notes yet. Start by creating your first
            note!
          </p>

          <Link
            href="/create"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-focus transition"
          >
            Create Note
          </Link>
        </div>
      )}

      {!loading && notes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {notes.map((note: Note) => (
            <div key={note._id} className="bg-base-200 p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">{note.title}</h3>

              <p className="text-gray-700 mb-4">{note.content}</p>

              <Link
                href={`/notedetails/${note._id}`}
                className="text-sm text-primary hover:underline"
              >
                Edit Note
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
