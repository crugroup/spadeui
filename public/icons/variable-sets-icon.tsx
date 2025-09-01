export default () => (
  <span role="img" className="ant-menu-item-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      {/* Curly braces for set notation */}
      <path
        d="M4 6C4 6 2 7 2 10C2 13 4 14 4 14C4 14 2 15 2 18C2 18 4 18 4 18"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 6C16 6 18 7 18 10C18 13 16 14 16 14C16 14 18 15 18 18C18 18 16 18 16 18"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Variables inside: x, y, z */}
      <text x="7" y="9" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">
        x
      </text>
      <text x="10" y="12" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">
        y
      </text>
      <text x="13" y="15" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">
        z
      </text>

      {/* Commas between variables */}
      <text x="8.5" y="10.5" textAnchor="middle" fontSize="5" fill="currentColor">
        ,
      </text>
      <text x="11.5" y="13.5" textAnchor="middle" fontSize="5" fill="currentColor">
        ,
      </text>
    </svg>
  </span>
);
