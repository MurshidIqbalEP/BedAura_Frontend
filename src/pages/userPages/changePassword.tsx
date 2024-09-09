import { useState } from "react";
import { changePassword } from "../../api/user";
import { toast } from "sonner";
import { Button, Input } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Change Password Form (example)
const ChangePassword = () => {
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [conform, setConform] = useState("");
    const [changepassErr, setChangepassErr] = useState({
      oldPasswordErr: "",
      newPasswordErr: "",
      conformErr: "",
    });

    const handlePasswordChange = async () => {
      console.log(oldPassword, newPassword, conform);

      const validationError = {
        oldPasswordErr: "",
        newPasswordErr: "",
        conformErr: "",
      };
      let valid = true;

      if (oldPassword.trim() === "" || oldPassword.length < 6) {
        validationError.oldPasswordErr = "6 digit number is required.";
        valid = false;
      }

      if (newPassword.trim() === "" || newPassword.length < 6) {
        validationError.newPasswordErr = "6 digit number is required.";
        valid = false;
      }
      if (conform !== newPassword) {
        validationError.conformErr = "Wrong conform password!";
        valid = false;
      }
      setChangepassErr(validationError);

      if (valid) {
        let response = await changePassword(
          oldPassword,
          newPassword,
          userInfo.email
        );

        if (response) {
          toast.success("passward changed");
          setOldPassword("");
          setNewPassword("");
          setConform("");
        }
      }
    };
    return (
      <div className="flex  justify-center min-h-screen ">
        <div className="bg-white mt-[30px] p-6 rounded-lg shadow-lg w-full h-fit max-w-sm">
          <h2 className="text-xl font-semibold text-center mb-4">
            Change Password
          </h2>
          <div className="space-y-3">
            <Input
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              variant="bordered"
            />
            {changepassErr.oldPasswordErr && (
              <p className="text-red-500 text-xs mt-0">
                {changepassErr.oldPasswordErr}
              </p>
            )}
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              variant="bordered"
            />
            {changepassErr.newPasswordErr && (
              <p className="text-red-500 text-xs mt-0">
                {changepassErr.newPasswordErr}
              </p>
            )}
            <Input
              label="Conform Password"
              type="password"
              value={conform}
              onChange={(e) => setConform(e.target.value)}
              variant="bordered"
            />
            {changepassErr.conformErr && (
              <p className="text-red-500 text-xs mt-0">
                {changepassErr.conformErr}
              </p>
            )}
            <Button onPress={handlePasswordChange} color="primary" fullWidth>
              Change Password
            </Button>
          </div>
        </div>
      </div>
    );
  };

  export default ChangePassword;
