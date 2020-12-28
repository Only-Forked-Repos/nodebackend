'use strict';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		email_id: {
			type: DataTypes.STRING(191),
			allowNull: false,
			// unique: true
		},
		password: {
			type: DataTypes.STRING(666),
			allowNull: false,
		},
		mobile: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
		status: {
			type: DataTypes.BOOLEAN(true),
			allowNull: true,
			defaultValue: '1'
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE
		}
	}, {
		tableName: 'users'
	});

	User.associate = function(models) {
		// associations can be defined here
	};

	// queries and other function
	User.getUser = async (reqData) => {
		try {
			return await User.findOne({
				where: {
					email_id: reqData.email_id
				},
				attributes: [
					'id','name','email_id','password','mobile','status'
				]
			});
		} catch (e) {
			return false;
		}
	}

	User.validatePassword = (pass, hashPass) => {
        return bcrypt.compareSync(pass, hashPass);
	}

	User.generateTokens = (userSerialize) => {
		const accessSecret = process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET : '';
        return {
            access_token : jwt.sign(userSerialize, accessSecret, { expiresIn: '16h' })
        }
	}

	return User;
};