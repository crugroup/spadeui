export default () => (
  <span role="img" className="ant-menu-item-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      {/* Left parenthesis */}
      <path
        d="M6 4C6 4 4 6 4 10C4 14 6 16 6 16"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Right parenthesis */}
      <path
        d="M14 4C14 4 16 6 16 10C16 14 14 16 14 16"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* X in the middle */}
      <path d="M8.5 7.5L11.5 12.5M11.5 7.5L8.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </span>
);
