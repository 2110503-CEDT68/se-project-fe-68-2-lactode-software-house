"use client";

import { useState } from "react";
import Button from "@/src/components/common/Button";
import { TriangleAlert } from "lucide-react";

interface DeletePopupProps {
  hotelId: string;
  onDelete?: () => void;
}

export default function DeletePopup({ hotelId, onDelete }: DeletePopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    // TODO: connect to delete API
    console.log("delete hotel", hotelId);
    onDelete?.();
    setIsOpen(false);
  };

  return (
    <>
      {/* Delete trigger button */}
      <Button variant="danger" className="btn-md" onClick={() => setIsOpen(true)}>
        delete
      </Button>

      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-3xl p-8 max-w-xl w-full mx-4 shadow-xl">
            <div className="flex flex-row items-center justify-center gap-8">
              
              {/* Warning icon */}
              <TriangleAlert className="w-16 h-16 text-red-500 flex-shrink-0" />

              {/* Message */}
              <div>
                <p className="text-lg font-bold text-gray-900 leading-snug">
                  Are you sure you want to delete this hotel?
                  <br />
                  This action cannot be undone.
                </p>
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-8">
              <Button variant="disabled" className="btn-md" onClick={() => setIsOpen(false)}>
                cancel
              </Button>
              <Button variant="danger" className="btn-md" onClick={handleDelete}>
                delete
              </Button>
            </div>
          </div>

        </div>
      )}
    </>
  );
}