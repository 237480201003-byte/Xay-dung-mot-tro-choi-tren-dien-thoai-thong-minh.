# -*- coding: utf-8 -*-
"""
Script tim va sua cac entry vi co nhieu mang (dinh dang bi hong).
"""
import re
import io

SRC = r'c:\Users\ASUS\Downloads\farming-game-main\farming-game-main\src\shell\core\strings.ts'

with io.open(SRC, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
n = len(lines)
new_lines = []
i = 0
fixed_count = 0
problems = []

while i < n:
    line = lines[i]

    # Tìm entry 'key': {
    m = re.match(r"^([ \t]*)'([\w.]+)':\s*\{\s*$", line)
    if m and not m.group(2).startswith('//'):
        entry_indent = m.group(1)
        key = m.group(2)

        # Thu thập entry
        entry_lines = [line]
        i += 1
        while i < n:
            entry_lines.append(lines[i])
            if re.match(r"^\s*\},?\s*$", lines[i]):
                break
            i += 1

        # Đếm số [ và ] trong entry
        full_text = '\n'.join(entry_lines)
        opens = full_text.count('[')
        closes = full_text.count(']')

        if opens > 5 or closes > 5:
            # Entry có nhiều mảng - cần sửa
            problems.append((key, opens, closes))
            fixed_count += 1

            # Cố gắng parse: tìm en và vi
            # Tìm en: [items],
            en_match = re.search(r'en:\s*\[(.*?)\]\s*,', full_text, re.DOTALL)
            vi_match = re.search(r'vi:\s*\[(.*?)\]\s*,?', full_text, re.DOTALL)

            if en_match and vi_match:
                en_content = en_match.group(1).strip()
                vi_content = vi_match.group(1).strip()

                # Tạo entry mới
                new_entry = f"{entry_indent}'{key}': {{\n{en_indent}  en: [{en_content}],\n{en_indent}  vi: [{vi_content}],\n{entry_indent}}}"
                if entry_lines[-1].endswith(',\n'):
                    new_entry += ','
                new_entry += '\n'

                # Tách thành các dòng
                for nl in new_entry.split('\n'):
                    if nl or new_lines:
                        new_lines.append(nl)
                i += 1
                continue

        new_lines.extend(entry_lines)
        i += 1
        continue

    new_lines.append(line)
    i += 1

print(f'Fixed entries: {fixed_count}')
for key, op, cl in problems[:20]:
    print(f'  {key}: [={op}, ]={cl}')