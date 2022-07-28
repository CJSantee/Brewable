class User < ApplicationRecord
	has_secure_password 
	
	validates :email, uniqueness: true
	validates :phone, uniqueness: true, :allow_blank => true
end