import Link from "next/link";
import { FaEdge, FaEdit, FaPlusCircle } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
 

export default function Navbar() {
  return (
    <header className="bg-base-300 border-b border-base-content/10 p-4 ">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tighter">
            Note App
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/create"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-focus transition"
            >
              <FaPlusCircle className="size-6" />
              <span className="hidden sm:inline">New Note</span>
            </Link>
           

          </div>
        </div>
      </div>
    </header>
  );
}