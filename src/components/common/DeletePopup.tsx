'use client';

import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import Button from '@/src/components/common/Button';

interface DeletePopupProps {
  itemId: string;
  itemLabel?: string;
  disabled?: boolean;
  onDelete?: (itemId: string) => void | Promise<void>;
  testIdPrefix?: string;
}

export default function DeletePopup({
  itemId,
  itemLabel = 'item',
  disabled = false,
  onDelete,
  testIdPrefix,
}: DeletePopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete?.(itemId);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="danger"
        className="btn-danger"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        testId={testIdPrefix ? `${testIdPrefix}-open` : undefined}
      >
        Delete
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" data-testid={testIdPrefix ? `${testIdPrefix}-dialog` : undefined}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} data-testid={testIdPrefix ? `${testIdPrefix}-overlay` : undefined} />

          <div className="relative mx-4 w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
            <div className="flex flex-row items-center justify-center gap-8">
              <TriangleAlert className="h-16 w-16 flex-shrink-0 text-red-500" />

              <div>
                <p className="text-lg font-bold leading-snug text-gray-900">
                  Are you sure you want to delete this {itemLabel}?
                  <br />
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <Button variant="disabled" className="btn-md" onClick={() => setIsOpen(false)} testId={testIdPrefix ? `${testIdPrefix}-cancel` : undefined}>
                Cancel
              </Button>
              <Button variant="danger" className="btn-md" onClick={handleDelete} testId={testIdPrefix ? `${testIdPrefix}-confirm` : undefined}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
