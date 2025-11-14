#!/bin/bash

# 设置目录路径
CONTENTS_DIR="./contents"
INDEX_FILE="./index.json"

# 检查contents目录是否存在
if [ ! -d "$CONTENTS_DIR" ]; then
    echo "错误: $CONTENTS_DIR 目录不存在"
    exit 1
fi

# 创建JSON数组开始
echo "[" > "$INDEX_FILE"

# 查找所有.md文件，排序并处理
find "$CONTENTS_DIR" -name "*.md" -type f | sort | while read -r file; do
    # 获取文件名（不含路径和扩展名）
    filename=$(basename "$file" .md)
    
    # 获取文件修改时间
    mod_time=$(stat -c %Y "$file")
    
    # 如果不是第一个文件，添加逗号
    if [ -s "$INDEX_FILE" ] && [ $(wc -l < "$INDEX_FILE") -gt 1 ]; then
        echo "," >> "$INDEX_FILE"
    fi
    
    # 添加JSON条目
    echo "  {" >> "$INDEX_FILE"
    echo "    \"name\": \"$filename\"," >> "$INDEX_FILE"
    echo "    \"path\": \"$file\"," >> "$INDEX_FILE"
    echo "    \"modTime\": $mod_time" >> "$INDEX_FILE"
    echo "  }" >> "$INDEX_FILE"
done

# 结束JSON数组
echo "]" >> "$INDEX_FILE"

echo "索引已生成到 $INDEX_FILE"
