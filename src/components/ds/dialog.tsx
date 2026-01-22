import * as React from "react";
import { experimental } from "@freenow/wave";
import { cn } from "./utils";

const { Modal } = experimental;
// Wave Modal can replace Dialog.
// It usually has isOpen, onClose, children.

// Adapting to Radix API (Root, Trigger, Content) is tricky.
// Better to export Modal directly and update consumers.

export {
  Modal as Dialog, // Alias for now, or just export Modal
  // Mock other parts or remove them and fix consumers.
};

// Strict adoption -> Use Wave API.
// Features using <Dialog><DialogTrigger>...</DialogTrigger><DialogContent>...</DialogContent></Dialog>
// will break if we just export default Modal.
// We need to refactor features or build a compat layer.
// Building a compat layer around Modal:
// Root -> manages state (open/setOpen)
// Trigger -> clones child and adds onClick
// Content -> renders Modal if open.

// This is getting complex for a "refactoring" step without touching features.
// But the user said "Can we just run the server again" before, implying they want it working.
// I should try to maintain API availability OR fix usage.
// "Strict Wave Adoption" implies getting rid of the Radix glue code.
// I will keep the file simple (re-export Wave) and assume I will fix usages in `src/features`.

export const { Modal: WaveModal } = experimental;
