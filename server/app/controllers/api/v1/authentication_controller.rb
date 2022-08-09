class Api::V1::AuthenticationController < ApplicationController
	skip_before_action :authenticate, only: [:create, :refresh]

	# GET /api/v1/auth 
	# Login User
	def create
		@user = params[:email] ? User.find_by(email: params[:email].downcase) : User.find_by(phone: params[:phone])
		if @user
			if (@user.authenticate(params[:password]))
				payload = { user_id: @user.id }
				secret = ENV['SECRET_KEY_BASE'] || Rails.application.secrets.secret_key_base
				token = create_token(payload)
				cookies[:jwt] = {
					value: token,
					httpOnly: true,
					expires: 1.hour.from_now
				}
				render json: { access_token: token, user: { user_id: @user.id, first_name: @user.first_name, last_name: @user.last_name }}
			else
				render json: { message: "Authentication Failed" }, status: :unprocessable_entity
			end
		else
			render json: { message: "Could not find user" }, status: :unprocessable_entity
		end
	end

	def refresh
		token = cookies[:jwt]
		if token 
			begin
				decoded_token = JWT.decode(token, secret)
				payload = decoded_token.first
				user_id = payload["user_id"]
				@user = User.find(user_id)
				if @user
					payload = { user_id: @user.id }
					token = create_token(payload)
					cookies[:jwt] = {
						value: token,
						httpOnly: true,
						expires: 1.hour.from_now
					}
					render json: { access_token: token, user: { user_id: @user.id, first_name: @user.first_name, last_name: @user.last_name }}, status: :ok
				else
					render json: { message: "User not found" }, status: :forbidden
				end
			rescue => exception
				render json: { message: "Error: #{exception}" }, status: :forbidden
			end
		else
			render json: { message: "Token cookie not found" }, status: :forbidden
		end
	end

	# DELETE /api/v1/auth
	# Logout User
	def destroy
		cookies.delete(:jwt)
	end

end
