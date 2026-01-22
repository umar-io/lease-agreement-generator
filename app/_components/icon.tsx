// app/components/icon.tsx
type IconProps = {
  name: string;
  className?: string;
};

const Icon = ({ name, className }: IconProps) => {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#${name}`} />
    </svg>
  );
};

// Export both named and default
export { Icon };
export default Icon;