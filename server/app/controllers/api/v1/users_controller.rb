class Api::V1::UsersController < ApplicationController

	# GET /api/v1/users
	def index
		render json: User.all.to_json(:only => [:id, :email, :first_name, :last_name, :phone]), status: :ok
	end

	# POST /api/v1/users
	def create 
		@user = User.new(user_params)
		if @user.save
			payload = { user_id: @user.id }
			token = create_token(payload)
			render json: { access_token: token, user_id: @user.id }, status: :created
		else
			render json: @user.errors, status: :unprocessable_entity
		end
	end

	private
	def user_params
		params.require(:user).permit(:email, :phone, :password, :first_name, :last_name)
	end
end
