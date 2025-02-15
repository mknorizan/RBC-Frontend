export const BOOKING_SELECTION_KEY = "rhumuda_booking_selection";

export interface BookingSelection {
  categoryId: number;
  packageId: string;
  timestamp: number; // For cleanup of stale data
}
