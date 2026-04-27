interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
      <p className="text-slate-500 font-medium text-sm mt-1">{subtitle}</p>
    </div>
  );
};
