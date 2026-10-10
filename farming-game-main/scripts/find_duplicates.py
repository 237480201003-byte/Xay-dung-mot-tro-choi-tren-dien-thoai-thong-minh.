# -*- coding: utf-8 -*-
"""
Tim cac entry vi co noi dung bi duplicate (do script truoc loi).
"""
import re
import io

SRC = r'c:\Users\ASUS\Downloads\farming-game-main\farming-game-main\src\shell\core\strings.ts'

with io.open(SRC, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
n = len(lines)
issues = []
i = 0

while i < n:
    line = lines[i]
    m = re.match(r"^([ \t]*)'([\w.]+)':\s*\{\s*$", line)
    if m and not m.group(2).startswith('//'):
        entry_lines = [line]
        i += 1
        while i < n:
            entry_lines.append(lines[i])
            if re.match(r"^\s*\},?\s*$", lines[i]):
                break
            i += 1
        full = '\n'.join(entry_lines)
        # Tim vi content
        vi_match = re.search(r'vi:\s*\[(.*?)\]\s*,?', full, re.DOTALL)
        if vi_match:
            vi_inner = vi_match.group(1)
            # Dem so cap nhay don
            single_quotes = vi_inner.count("'")
            # Neu nhieu hon 10 (5 cap), co the bi duplicate
            if single_quotes > 10:
                issues.append((m.group(2), single_quotes, vi_inner[:100]))
        continue
    i += 1

print(f'Entries with many quotes in vi: {len(issues)}')
for k, q, v in issues[:15]:
    print(f'  {k}: {q} quotes')
    print(f'    vi: {v}')