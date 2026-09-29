/**
 * Standard Grading Scale Utility for Minister Sam Academy
 * Scale:
 * 80 - 100: A (Distinction, 4.0 GP)
 * 70 - 79:  B (Very Good, 3.5 GP)
 * 60 - 69:  C (Credit, 3.0 GP)
 * 50 - 59:  D (Pass, 2.0 GP)
 * 0 - 49:   F (Fail, 0.0 GP)
 */

export interface GradeInfo {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  gradePoint: number;
  remarks: string;
}

export function calculateGrade(score: number): GradeInfo {
  if (score >= 80) {
    return { grade: 'A', gradePoint: 4.0, remarks: 'Distinction' };
  } else if (score >= 70) {
    return { grade: 'B', gradePoint: 3.5, remarks: 'Very Good' };
  } else if (score >= 60) {
    return { grade: 'C', gradePoint: 3.0, remarks: 'Good Credit' };
  } else if (score >= 50) {
    return { grade: 'D', gradePoint: 2.0, remarks: 'Fair Pass' };
  } else {
    return { grade: 'F', gradePoint: 0.0, remarks: 'Needs Improvement' };
  }
}
