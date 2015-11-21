import sublime, sublime_plugin

class DoubleClickCommand(sublime_plugin.TextCommand):
	def run(self, edit, by):
		word_separators = self.view.settings().get('word_separators', u"") + ".: \t\n"
		sels = self.view.sel()
		sel = sels[0]
		a = sel.begin()
		b = sel.end()
		start = 0
		end = self.view.size()
		for i in range(a-1,0,-1):
			if self.view.substr(i) in word_separators:
				start = i
				break

		for i in range(b,self.view.size(),1):
			if self.view.substr(i) in word_separators:
				end = i
				break
		if start != 0 :
			start +=1
		reg = sublime.Region(start,end)
		sels.add(reg)
		#self.view.run_command("drag_select",{"by": u"words"})

class QuickExpandSelectionWordCommand(sublime_plugin.TextCommand):
	def isWord(self,word):
		if(len(word)<=0):
			return False
		word_separators = self.view.settings().get('word_separators', u"") + ".: \t\n"
		for c in word_separators:
			if c in word:
				return False
		return True
	def run(self, edit):
		word_separators = self.view.settings().get('word_separators', u"") + ".: \t\n"
		sels = self.view.sel()
		if len(sels) <=0 :
			return 
		sel = sels[0]
		a = sel.begin()
		b = sel.end()
		start = 0
		end = self.view.size()
		for i in range(a-1,0,-1):
			if self.view.substr(i) in word_separators:
				start = i
				break

		for i in range(b,self.view.size(),1):
			if self.view.substr(i) in word_separators:
				end = i
				break
		if start != 0 :
			start +=1

		fromPosition = 0
		reg = sublime.Region(start,end)
		#sels.add(reg)
		patterm = self.view.substr(reg)
		if self.isWord(patterm) == False:
			print("don't select text")
			return 
		count = 0;
		sels.clear()
		while(fromPosition < self.view.size() ):
			regTmp = self.view.find(patterm,fromPosition)
			if (regTmp == None or regTmp.end() == -1):
				break;
			fromPosition = regTmp.end()
			sels.add(regTmp)
			count = count + 1
			if count > 1000 :
				break;

		

