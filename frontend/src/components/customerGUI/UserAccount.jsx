export function UserAccountManagement({state,NavigateTo}) {
    console.log("users: " + state.users)
    return (
        <div className="acc-container">
            <div className="acc-breadcrumb">
                <a onClick={() => NavigateTo('HomePage')}>Home</a>/<a><b>Account</b></a>
            </div>
            <div className="profile-form">
                <h2>Chỉnh sửa hồ sơ</h2>
                <div className="form-group">
                    <div className="full-width">
                        <label htmlFor="firstName">Tên</label>
                        <input type="text" id="firstName" placeholder="Nhập tên"/>
                    </div>
                    <div className="full-width">
                        <label htmlFor="lastName">Họ và tên lót</label>
                        <input type="text" id="lastName" placeholder="Nhập họ và tên lót"/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="full-width">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="Nhập email"/>
                    </div>
                    <div className="full-width">
                        <label htmlFor="address">Địa chỉ</label>
                        <input type="text" id="address" placeholder="Nhập địa chỉ"/>
                    </div>
                </div>
                <h3>Thay đổi mật khẩu</h3>
                <div className="form-group">
                    <input type="password" className="full-width" placeholder="Mật khẩu hiện tại"/>
                </div>
                <div className="form-group">
                    <input type="password" className="full-width" placeholder="Mật khẩu mới"/>
                </div>
                <div className="form-group">
                    <input type="password" className="full-width" placeholder="Nhập lại mật khẩu mới"/>
                </div>
                <div className="form-actions">
                    <button className="btn-cancel">Hủy</button>
                    <button className="btn-save">Lưu thay đổi</button>
                </div>
            </div>
        </div>
    );
}

export default UserAccountManagement;