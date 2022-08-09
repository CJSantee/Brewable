Rails.application.routes.draw do
	# For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
	namespace :api do 
		namespace :v1 do 
			post '/auth' => 'authentication#create'
			get '/refresh' => 'authentication#refresh'
			delete '/auth' => 'authentication#destroy'

			resources :users, only: [:index, :show, :update, :create]
		end
	end

end
