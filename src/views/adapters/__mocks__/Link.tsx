export const Link: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}): JSX.Element => <a href={to}>{children}</a>
