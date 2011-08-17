watch('(.*)\.coffee') { |md| run_coffee(md[0])}
watch('(.*)/(.*)\.coffee') { |md| run_coffee(md[0])}

watch('public/stylesheets/(.*)\.scss') {|md| puts "changed scss";system("sass --scss #{md[0]} public/stylesheets/#{md[1]}.css")}

def run_coffee(file)
  puts "*****************************************************************"
  puts "Running: #{file}"
  puts system("coffee -c #{file}")
  puts "*****************************************************************"
end
