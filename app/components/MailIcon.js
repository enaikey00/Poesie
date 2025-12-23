export default function MailIcon({ size = 24 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: 'inline-block', verticalAlign: 'top', marginRight: '0.3rem', transform: 'scale(1.1)'}}
    >
      <path fill="#D35400" fillRule="evenodd" d="M96.015 38.988H4.006c-1.104 0-2 .897-2 2.005v57.001c0 1.108.896 2.006 2 2.006h92.009a2.003 2.003 0 0 0 2.001-2.006V40.993a2.003 2.003 0 0 0-2.001-2.005" clipRule="evenodd"/>
      <path fill="#ECF0F1" fillRule="evenodd" d="M5 15.974v82.004C5 99.095 5.896 100 7 100h86.001A2.01 2.01 0 0 0 95 97.979V1.99a2.01 2.01 0 0 0-1.999-2.021l-71.997.008z" clipRule="evenodd"/>
      <path d="m40 72l54.997-33L95 45.98L51.028 72z" opacity=".1"/>
      <path fill="#F39C12" fillRule="evenodd" d="M2 97.991c0 1.11.895 2.009 2 2.009h92c1.104 0 2-.899 2-2.009V42L50 71L2 42z" clipRule="evenodd"/>
      <path fill="#F1C40F" fillRule="evenodd" d="m5 15.974l16.001.01V0z" clipRule="evenodd"/>
      <path fill="#F1C40F" d="m2 42l.052 54L50 71z"/>
      <path fill="#E57E22" d="M98 42L50 71l48 25z"/>
      <path fillRule="evenodd" d="M98 97.991V96L50 71l47.328 28.482c.409-.367.672-.896.672-1.491m-96 0V96l48-25L2.672 99.482A2 2 0 0 1 2 97.991" clipRule="evenodd" opacity=".3"/>
    </svg>
  )
}