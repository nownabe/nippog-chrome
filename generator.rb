require 'cgi'

Nippog::App.controllers :generator do
  get :index, :map => '/' do
    if request.xhr?
      
      chapters = []
      
      lnum = 1
      loop do
        break if !params.has_key?("l#{lnum}t") or params["l#{lnum}t"].blank?
        chapters << {:title => params["l#{lnum}t"], :sections => []}
        
        mnum = 1
        loop do
          break if !params.has_key?("l#{lnum}m#{mnum}t") or params["l#{lnum}m#{mnum}t"].blank?
          chapters[lnum-1][:sections] << {
            :title => params["l#{lnum}m#{mnum}t"], 
            :content => params["l#{lnum}m#{mnum}c"]
          }
          
          mnum += 1
        end
        lnum += 1
      end

      src = ""      
      
      # table of contents
      src << "<ol>\n"
      chapters.each do |c|
        src << "<li>#{c[:title]}</li>\n"
      end
      src << "</ol>\n"
      
      # contents
      chapters.each_with_index do |c, i|
        src << "<p><strong><u>#{i+1}. #{c[:title]}</u></strong></p>"
        
        c[:sections].each do |s|
          src << "<p><u>#{s[:title]}</u></p>"
          src << itemize(s[:content])
        end
      end
      
      
      src
    else
      render 'generator/index'
    end
  end


end