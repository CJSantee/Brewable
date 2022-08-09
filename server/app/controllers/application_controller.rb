class ApplicationController < ActionController::API
	include ::ActionController::Cookies
	before_action :authenticate
	before_action :set_cors
	
	def authenticate
		token = cookies[:jwt]
		if token 
			begin
				decoded = JWT.decode(token, secret)[0]
				user_id = decoded["user_id"]
				@user = User.find(user_id)
			rescue => exception
				render json: { message: "Error: #{exception}" }, status: :forbidden
			end
		else
			render json: { message: "Token cookie not found" }, status: :forbidden
		end
	end

	def secret
		secret = ENV['SECRET_KEY_BASE'] || Rails.application.secrets.secret_key_base
	end

	def create_token(payload)
		JWT.encode(payload, secret)
	end

	def set_cors
		headers['Access-Control-Allow-Origin'] = ENV['CLIENT_URL']
		headers['Access-Control-Request-Method'] = '*'
	end
	
end
