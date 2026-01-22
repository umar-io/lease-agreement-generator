type IconProps = {
  name: string;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  return (
    <svg className={className}>
      <use href={`#${name}`} />
    </svg>
  );
}
