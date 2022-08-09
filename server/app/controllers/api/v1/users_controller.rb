class Api::V1::UsersController < ApplicationController
	skip_before_action :authenticate, only: [:create]

	# GET /api/v1/users
	def index
		render json: User.all.to_json(:only => [:id, :email, :first_name, :last_name, :phone]), status: :ok
	end

	def show
		@user = User.find(params[:id])
		render json: @user.to_json(:only => [:id, :first_name, :last_name, :email, :phone]), status: :ok
	end

	# POST /api/v1/users
	def create 
		@user = User.new(user_params)
		if @user.save
			payload = { user_id: @user.id }
			token = create_token(payload)
			cookies[:jwt] = {
				value: token,
				httponly: true,
				expires: 1.hour.from_now
			}
			render json: { access_token: token, user: { user_id: @user.id, first_name: @user.first_name, last_name: @user.last_name }}, status: :created
		else
			# TODO: Return 409 (:conflict) for email / phone already in use
			render json: @user.errors, status: :unprocessable_entity
		end
	end

	def update
		@user = User.find(params[:id])
		if @user.update!(user_params)
			render json: User.find(params[:id]).to_json(:only => [:id, :first_name, :last_name, :email, :phone]), status: :ok
		else
			render json: @user.errors, status: :unprocessable_entity
		end
    end

	private
	def user_params
		params.require(:user).permit(:email, :phone, :password, :first_name, :last_name)
	end
end
