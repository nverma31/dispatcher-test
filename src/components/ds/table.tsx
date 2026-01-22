import { experimental } from "@freenow/wave";

// Destructure from experimental
const { Table, TableHeader, TableBody, Column, Row, Cell } = experimental;

// Re-export with Shadcn-compatible names where possible, or just standard names
export {
  Table,
  TableHeader,
  TableBody,
  Column as TableHead,
  Row as TableRow,
  Cell as TableCell,
  // Export originals too if needed
  Column,
  Row,
  Cell
};
