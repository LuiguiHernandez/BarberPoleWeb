import { BellIcon } from "./icons/BellIcon";
import { CalendarIcon } from "./icons/CalendarIcon";
import { ChartIcon } from "./icons/ChartIcon";
import { ChatIcon } from "./icons/ChatIcon";
import { ClockIcon } from "./icons/ClockIcon";
import { CopyIcon } from "./icons/CopyIcon";
import { CreditCardIcon } from "./icons/CreditCardIcon";
import { EditIcon } from "./icons/EditIcon";
import { GearIcon } from "./icons/GearIcon";
import { HeartIcon } from "./icons/HeartIcon";
import { PlusIcon } from "./icons/PlusIcon";
import { ScissorsIcon } from "./icons/ScissorsIcon";
import { SearchIcon } from "./icons/SearchIcon";
import { SparkleIcon } from "./icons/SparkleIcon";
import { StoreIcon } from "./icons/StoreIcon";
import { TrashIcon } from "./icons/TrashIcon";
import { UploadIcon } from "./icons/UploadIcon";
import { UsersIcon } from "./icons/UsersIcon";
import { WhatsappIcon } from "./icons/WhatsappIcon";
import { cn } from "../utils/cn";

export type IconName =
  | "store"
  | "scissors"
  | "users"
  | "clock"
  | "calendar"
  | "creditcard"
  | "bell"
  | "chart"
  | "chat"
  | "heart"
  | "sparkle"
  | "gear"
  | "search"
  | "plus"
  | "edit"
  | "trash"
  | "copy"
  | "whatsapp"
  | "upload";

function renderIcon(name: IconName, size: number) {
  switch (name) {
    case "store":      return <StoreIcon size={size} />;
    case "scissors":   return <ScissorsIcon size={size} />;
    case "users":      return <UsersIcon size={size} />;
    case "clock":      return <ClockIcon size={size} />;
    case "calendar":   return <CalendarIcon size={size} />;
    case "creditcard": return <CreditCardIcon size={size} />;
    case "bell":       return <BellIcon size={size} />;
    case "chart":      return <ChartIcon size={size} />;
    case "chat":       return <ChatIcon size={size} />;
    case "heart":      return <HeartIcon size={size} />;
    case "sparkle":    return <SparkleIcon size={size} />;
    case "gear":       return <GearIcon size={size} />;
    case "search":     return <SearchIcon size={size} />;
    case "plus":       return <PlusIcon size={size} />;
    case "edit":       return <EditIcon size={size} />;
    case "trash":      return <TrashIcon size={size} />;
    case "copy":       return <CopyIcon size={size} />;
    case "whatsapp":   return <WhatsappIcon size={size} />;
    case "upload":     return <UploadIcon size={size} />;
    default:           return null;
  }
}

export function Icon({ name, size = 18, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex opacity-70 transition-opacity hover:opacity-100", className)}>
      {renderIcon(name, size)}
    </span>
  );
}
