import { Button } from "@/components/ds/button";

const DropdownSelectIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
  >
    <path
      d="M11.2487 15.6585C11.6471 16.1138 12.3555 16.1138 12.7539 15.6585L17.5501 10.1771C18.1159 9.53048 17.6567 8.51855 16.7975 8.51855L7.20507 8.51855C6.34591 8.51855 5.88673 9.53048 6.45249 10.1771L11.2487 15.6585Z"
      fill="#675B5B"
    />
  </svg>
);

export function Header() {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-0">
        <h1>Dispatcher Hamburg</h1>
        <Button variant="ghost" size="icon">
          <DropdownSelectIcon />
        </Button>
      </div>
    </div>
  );
}