import Button from '@/src/components/common/Button';

type AccountInfoCardProps = {
    fullName: string;
    username: string;
    email: string;
    tel: string;
    onLogout: () => void;
    onEditProfile: () => void;
    onChangePassword: () => void;
};

export default function AccountInfoCard({
    fullName,
    username,
    email,
    tel,
    onLogout,
    onEditProfile,
    onChangePassword,
}: AccountInfoCardProps) {
    return (
        <section className="card account-card">
            <h2 className="account-card__title text-subtitle">
                Account Information
            </h2>
            <div className="account-info-grid">
                <div className="card-soft account-info-box">
                    <p className="account-info-box__label text-caption">Full Name</p>
                    <p className="account-info-box__value text-body">{fullName}</p>
                </div>
                <div className="card-soft account-info-box">
                    <p className="account-info-box__label text-caption">Email</p>
                    <p className="account-info-box__value text-body">{email || '-'}</p>
                </div>
                <div className="card-soft account-info-box">
                    <p className="account-info-box__label text-caption">Username</p>
                    <p className="account-info-box__value text-body">{username || '-'}</p>
                </div>

                <div className="card-soft account-info-box">
                    <p className="account-info-box__label text-caption">Phone Number</p>
                    <p className="account-info-box__value text-body">{tel || '-'}</p>
                </div>
            </div>

            <div className="account-card__actions">
                <div>
                    <Button variant="danger" className="btn-sm" onClick={onLogout}>
                        Logout
                    </Button>
                </div>

                <div>
                    <Button variant="primary" className="btn-sm" onClick={onEditProfile}>
                        Change Profile
                    </Button>

                    <Button variant="primary" className="btn-sm" onClick={onChangePassword}>
                        Change Password
                    </Button>
                </div>
            </div>
        </section>
    );
}
