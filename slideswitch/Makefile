BUILD_DIR = build
SRC_DIR = javascripts

TARGET=jquery.slideswitch

JS = java -jar $(BUILD_DIR)/js.jar
VER = $(BUILD_DIR)/version.rb

REVISION = `$(VER) version.txt ../`

SCRIPTS = \
	$(SRC_DIR)/$(TARGET).js \
	$(NULL)

all: min

script: $(SCRIPTS)
	cat $(SCRIPTS) | sed "s/@VERSION/$(REVISION)/" > $(TARGET)_src.js

min: script
	$(JS) $(BUILD_DIR)/min.js $(TARGET)_src.js $(TARGET)_min.js

pack: script
	$(JS) $(BUILD_DIR)/pack.js $(TARGET)_src.js $(TARGET)_pack.js

clean:
	rm -rf $(TARGET)_*.js
