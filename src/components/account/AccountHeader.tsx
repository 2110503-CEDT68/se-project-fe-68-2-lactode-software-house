type AccountHeaderProps = {
    name: string;
};

export default function AccountHeader({ name }: AccountHeaderProps) {
    return (
        <section className="account-header">
            <p className="account-header__eyebrow">My Profile</p>
            <h2 className="account-header__title text-subtitle ">
                Welcome back, {name}
            </h2>

            <p className="account-header__subtitle text-body">
                Manage your account details and keep your password secure.
            </p>
        </section>
    );
}