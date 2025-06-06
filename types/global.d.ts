declare global {
  interface Window {
    bootstrap: {
      Tooltip: any;
      Popover: any;
      Collapse: any;
    };
  }
}

export {};
