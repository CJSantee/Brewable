class Api::V1::AuthenticationController < ApplicationController
	skip_before_action :authenticate, only: [:login]

	def login
		@user = params[:email] ? User.find_by(email: params[:email].downcase) : User.find_by(phone: params[:phone])
		if @user
			if (@user.authenticate(params[:password]))
				payload = { user_id: @user.id }
				secret = ENV['SECRET_KEY_BASE'] || Rails.application.secrets.secret_key_base
				token = create_token(payload)
				render json: { access_token: token, user_id: @user.id, first_name: @user.first_name, last_name: @user.last_name }
			else
				render json: { message: "Authentication Failed" }
			end
		else
			render json: { message: "Could not find user" }
		end
	end

end
