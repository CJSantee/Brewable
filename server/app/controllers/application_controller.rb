class ApplicationController < ActionController::API

	def secret
		secret = ENV['SECRET_KEY_BASE'] || Rails.application.secrets.secret_key_base
	end

	def create_token(payload)
		JWT.encode(payload, secret)
	end
	
end
