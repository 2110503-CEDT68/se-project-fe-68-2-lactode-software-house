type AccountSidebarProps = {
    fullName: string;
    email: string;
    roleLabel: string;
    initial: string;
  };
  
  export default function AccountSidebar({
    fullName,
    email,
    roleLabel,
    initial,
  }: AccountSidebarProps) {
    return (
      <aside className="card account-sidebar">
        <div className="account-sidebar__avatar">{initial}</div>
  
        <h2 className="account-sidebar__name">{fullName}</h2>
  
        <p className="account-sidebar__email">{email}</p>
  
        <span className="account-sidebar__badge">{roleLabel}</span>
      </aside>
    );
  }