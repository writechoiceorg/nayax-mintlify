export const PostmanButton = ({ href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#FF6C37] hover:bg-[#e85e2c] text-white font-semibold text-sm no-underline border-b-0 transition-colors"
    >
      <Icon icon="play" icontType="solid" color="#ffffff" />
      Run in Postman
    </a>
  );
};
