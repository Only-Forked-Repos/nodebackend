import sCode from "../../custom/status-codes";
const { ok, bad_request, un_authorized, server_error } = sCode;

import { getValidationErrMsg } from '../../custom/error-msg';

// models import here
import model from '../../db/models';
const { User } = model;

// validation import here
import validateLogin from '../../requests/loginRequest';

export default {
    async getLogin(req, res) {
        try {
            const { error } = validateLogin(req.body);
            if (error) return res.status(bad_request).send({ error: getValidationErrMsg(error) });

            const user = await User.getUser(req.body);
            if (!user) return res.status(bad_request).send({ error: { email_id: "Email does't exists."} });

            if (!User.validatePassword(req.body.password, user.password)) return res.status(un_authorized).send({ error: { password: "Incorrect Password"} });

            const { id, email_id, name, mobile } = user;
            const userSerialize = { id, email_id, name, mobile };
            const token = User.generateTokens(userSerialize);

            res.status(ok).send({ user, token });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },
}