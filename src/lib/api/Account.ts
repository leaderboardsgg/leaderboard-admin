/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
	ChangePasswordRequest,
	LoginRequest,
	LoginResponse,
	ProblemDetails,
	RecoverAccountRequest,
	RegisterRequest,
	UserViewModel,
	ValidationProblemDetails
} from './data-contracts'
import { ContentType, HttpClient, RequestParams } from './http-client'

export class Account<
	SecurityDataType = unknown
> extends HttpClient<SecurityDataType> {
	/**
	 * No description
	 *
	 * @tags Account
	 * @name Register
	 * @summary Registers a new User.
	 * @request POST:/Account/register
	 * @secure
	 * @response `201` `UserViewModel` The `User` was registered and returned successfully.
	 * @response `400` `ProblemDetails` Bad Request
	 * @response `409` `ValidationProblemDetails` A `User` with the specified username or email already exists. Validation error codes by property: - **Username**: - **UsernameTaken**: the username is already in use - **Email**: - **EmailAlreadyUsed**: the email is already in use
	 * @response `422` `ValidationProblemDetails` The request contains errors. Validation error codes by property: - **Username**: - **UsernameFormat**: Invalid username format - **Password**: - **PasswordFormat**: Invalid password format - **Email**: - **EmailValidator**: Invalid email format
	 * @response `500` `void` Internal Server Error
	 */
	register = (data: RegisterRequest, params: RequestParams = {}) =>
		this.request<
			UserViewModel,
			ProblemDetails | ValidationProblemDetails | void
		>({
			path: `/Account/register`,
			method: 'POST',
			body: data,
			secure: true,
			type: ContentType.Json,
			format: 'json',
			...params
		})
	/**
	 * No description
	 *
	 * @tags Account
	 * @name Login
	 * @summary Logs a User in.
	 * @request POST:/login
	 * @secure
	 * @response `200` `LoginResponse` The `User` was logged in successfully. A `LoginResponse` is returned, containing a token.
	 * @response `400` `ProblemDetails` Bad Request
	 * @response `401` `void` The password given was incorrect.
	 * @response `403` `void` The associated `User` is banned.
	 * @response `404` `void` No `User` with the requested details could be found.
	 * @response `422` `ValidationProblemDetails` The request contains errors. Validation error codes by property: - **Password**: - **NotEmptyValidator**: No password was passed - **PasswordFormat**: Invalid password format - **Email**: - **NotEmptyValidator**: No email was passed - **EmailValidator**: Invalid email format
	 * @response `500` `void` Internal Server Error
	 */
	login = (data: LoginRequest, params: RequestParams = {}) =>
		this.request<
			LoginResponse,
			ProblemDetails | void | ValidationProblemDetails
		>({
			path: `/login`,
			method: 'POST',
			body: data,
			secure: true,
			type: ContentType.Json,
			format: 'json',
			...params
		})
	/**
	 * No description
	 *
	 * @tags Account
	 * @name ResendConfirmationEmail
	 * @summary Resends the account confirmation link.
	 * @request POST:/Account/confirm
	 * @secure
	 * @response `200` `void` A new confirmation link was generated.
	 * @response `400` `ProblemDetails` Bad Request
	 * @response `401` `void` Unauthorized
	 * @response `409` `void` The `User`'s account has already been confirmed.
	 * @response `500` `void` The account recovery email failed to be created.
	 */
	resendConfirmationEmail = (params: RequestParams = {}) =>
		this.request<void, ProblemDetails | void>({
			path: `/Account/confirm`,
			method: 'POST',
			secure: true,
			...params
		})
	/**
	 * No description
	 *
	 * @tags Account
	 * @name SendRecoveryEmail
	 * @summary Sends an account recovery email.
	 * @request POST:/Account/recover
	 * @secure
	 * @response `200` `void` This endpoint returns 200 OK regardless of whether the email was sent successfully or not.
	 * @response `400` `ProblemDetails` Bad Request
	 * @response `500` `void` Internal Server Error
	 */
	sendRecoveryEmail = (
		data: RecoverAccountRequest,
		params: RequestParams = {}
	) =>
		this.request<void, ProblemDetails | void>({
			path: `/Account/recover`,
			method: 'POST',
			body: data,
			secure: true,
			type: ContentType.Json,
			...params
		})
	/**
	 * No description
	 *
	 * @tags Account
	 * @name ConfirmAccount
	 * @summary Confirms a user account.
	 * @request PUT:/Account/confirm/{id}
	 * @secure
	 * @response `200` `void` The account was confirmed successfully.
	 * @response `400` `ProblemDetails` Bad Request
	 * @response `404` `void` The token provided was invalid or expired.
	 * @response `409` `void` the user's account was either already confirmed or banned.
	 * @response `500` `void` Internal Server Error
	 */
	confirmAccount = (id: string, params: RequestParams = {}) =>
		this.request<void, ProblemDetails | void>({
			path: `/Account/confirm/${id}`,
			method: 'PUT',
			secure: true,
			...params
		})
	/**
	 * No description
	 *
	 * @tags Account
	 * @name TestRecoveryToken
	 * @summary Tests an account recovery token for validity.
	 * @request GET:/Account/recover/{id}
	 * @secure
	 * @response `200` `void` The token provided is valid.
	 * @response `400` `ProblemDetails` Bad Request
	 * @response `404` `void` The token provided is invalid or expired, or the user is banned.
	 * @response `500` `void` Internal Server Error
	 */
	testRecoveryToken = (id: string, params: RequestParams = {}) =>
		this.request<void, ProblemDetails | void>({
			path: `/Account/recover/${id}`,
			method: 'GET',
			secure: true,
			...params
		})
	/**
	 * No description
	 *
	 * @tags Account
	 * @name ChangePassword
	 * @summary Recover the user's account by resetting their password to a new value.
	 * @request POST:/Account/recover/{id}
	 * @secure
	 * @response `200` `void` The user's password was reset successfully.
	 * @response `400` `ProblemDetails` Bad Request
	 * @response `403` `void` The user is banned.
	 * @response `404` `void` The token provided is invalid or expired.
	 * @response `409` `void` The new password is the same as the user's existing password.
	 * @response `422` `ValidationProblemDetails` The request body contains errors. A **PasswordFormat** Validation error on the Password field indicates that the password format is invalid.
	 * @response `500` `void` Internal Server Error
	 */
	changePassword = (
		id: string,
		data: ChangePasswordRequest,
		params: RequestParams = {}
	) =>
		this.request<void, ProblemDetails | void | ValidationProblemDetails>({
			path: `/Account/recover/${id}`,
			method: 'POST',
			body: data,
			secure: true,
			type: ContentType.Json,
			...params
		})
}