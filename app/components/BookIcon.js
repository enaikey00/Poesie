export default function BookIcon({ size = 24, style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: 'inline-block', verticalAlign: 'top', marginRight: '0.3rem', transform: 'scale(1.1)', ...style}}
    >
      <path fill="#C0392B" fillRule="evenodd" d="M6 100h88a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6H6a6 6 0 0 0-6 6v88a6 6 0 0 0 6 6" clipRule="evenodd"/>
      <path fill="#E74C3C" fillRule="evenodd" d="M100 30h-.025a5.5 5.5 0 0 0-5.475-5H6.25C2.937 25 0 22.314 0 19V6a6 6 0 0 1 6-6h88c3.313 0 6 2.687 6 6.001z" clipRule="evenodd"/>
      <path fillRule="evenodd" d="M5 100h2V0H5z" clipRule="evenodd" opacity=".15"/>
      <path fill="#fff" fillRule="evenodd" d="M7 100h2V0H7z" clipRule="evenodd" opacity=".15"/>
      <path fill="#fff" fillRule="evenodd" d="M100 10.001a5 5 0 0 0-5-5H7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h87a6 6 0 0 1 6 6v-15h-.101q.1-.486.101-1" clipRule="evenodd"/>
      <path fill="#95A5A6" fillRule="evenodd" d="M100 15.423v-3.921s.183-4-5-4H5v2h89a5.995 5.995 0 0 1 5.98 5.616c-.107-1-.789-3.615-4.98-3.615H5v2h89a5.995 5.995 0 0 1 5.98 5.616c-.107-1.001-.789-3.616-4.98-3.616H5v2h89a6 6 0 0 1 6 6z" clipRule="evenodd" opacity=".2"/>
      <path fill="#2980B9" fillRule="evenodd" d="M80 100h10V25H80z" clipRule="evenodd"/>
      <path fill="#3498DB" fillRule="evenodd" d="M80 25.007h10V0H80z" clipRule="evenodd"/>
      <path fillRule="evenodd" d="M82 100h2V0h-2zM86 0v100h2V0z" clipRule="evenodd" opacity=".1"/>
    </svg>
  )
}