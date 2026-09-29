import { TimetableEntry, ConflictCheckResult, ConflictDetail } from '../types';

/**
 * Converts a "HH:mm" 24h string to total minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Checks if two time intervals on the same day overlap
 * Standard interval overlap: (startA < endB) && (endA > startB)
 */
export function timesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);

  return aStart < bEnd && aEnd > bStart;
}

/**
 * Validates a proposed TimetableEntry against all existing entries in the timetable.
 * Detects:
 *  1. Teacher clash: Teacher assigned to another class during overlapping hours
 *  2. Class clash: Class assigned to another subject/teacher during overlapping hours
 *  3. Room clash: Room occupied by another class during overlapping hours
 * 
 * @param proposed The entry being created or updated
 * @param existingEntries List of all entries in the current timetable
 * @param excludeEntryId ID to exclude (when editing an existing entry)
 */
export function checkTimetableConflicts(
  proposed: Omit<TimetableEntry, 'id'>,
  existingEntries: TimetableEntry[],
  excludeEntryId?: string
): ConflictCheckResult {
  const conflicts: ConflictDetail[] = [];

  const candidates = existingEntries.filter(
    (e) => e.timetableId === proposed.timetableId &&
           e.day === proposed.day &&
           e.id !== excludeEntryId
  );

  for (const entry of candidates) {
    if (timesOverlap(proposed.startTime, proposed.endTime, entry.startTime, entry.endTime)) {
      // 1. Teacher conflict
      if (entry.teacherId === proposed.teacherId) {
        conflicts.push({
          type: 'teacher',
          message: `Teacher ${proposed.teacherName || 'selected'} is already assigned to ${entry.className} (${entry.subjectName}) from ${entry.startTime} to ${entry.endTime}.`,
          existingEntry: entry,
        });
      }

      // 2. Class conflict
      if (entry.classId === proposed.classId) {
        conflicts.push({
          type: 'class',
          message: `Class ${proposed.className || 'selected'} already has ${entry.subjectName} scheduled with ${entry.teacherName} from ${entry.startTime} to ${entry.endTime}.`,
          existingEntry: entry,
        });
      }

      // 3. Room conflict
      if (proposed.room && entry.room && entry.room.trim().toLowerCase() === proposed.room.trim().toLowerCase()) {
        conflicts.push({
          type: 'room',
          message: `Room "${proposed.room}" is already reserved for ${entry.className} (${entry.subjectName}) from ${entry.startTime} to ${entry.endTime}.`,
          existingEntry: entry,
        });
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
}
