# Load the Rails application.
require_relative "application"

# Load local ENV variables
env = File.join(Rails.root, 'config', 'set_env.rb')
load(env) if File.exist?(env)

# Initialize the Rails application.
Rails.application.initialize!
