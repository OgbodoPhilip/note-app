"use client";

import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Create() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

 const handleSubmit = async (
   e: React.FormEvent<HTMLFormElement>,
 ): Promise<void> => {
   e.preventDefault();

   if (!title.trim() || !content.trim()) {
     toast.error("Please fill in all fields");
     return;
   }

   setLoading(true);

   try {
     await axios.post("http://localhost:5000/api/notes", {
       title,
       content,
     });

     toast.success("Note created successfully!");

     router.push("/");
   } catch (error: unknown) {
     console.error(error);

     if (axios.isAxiosError(error)) {
       toast.error(
         typeof error.response?.data?.message === "string"
           ? error.response.data.message
           : "Failed to create note",
       );
     } else {
       toast.error("Something went wrong");
     }
   } finally {
     setLoading(false);
   }
 };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="btn btn-ghost mb-4">
            <FaArrowLeft className="mr-2" />
            Back to Notes
          </Link>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create a New Post</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-2"
                  >
                    Title
                  </label>

                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter note title"
                    required
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium mb-2"
                  >
                    Content
                  </label>

                  <textarea
                    id="content"
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your note here..."
                    required
                    className="textarea textarea-bordered w-full"
                  />
                </div>

                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
