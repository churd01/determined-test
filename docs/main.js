async function loadScene(sceneId) {
    const res = await fetch(`${sceneId}.md`);
    const raw = await res.text();
    const [, yaml, markdown] = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/m.exec(raw);
  
    const meta = {};
    yaml.split('\n').forEach(line => {
      if (line.startsWith('  - ')) {
        const [text, id] = line.slice(4).split(' => ');
        if (!meta.choices) meta.choices = [];
        meta.choices.push({ text: text.trim(), nextSceneId: id.trim() });
      } else {
        const [key, value] = line.split(':');
        meta[key.trim()] = value.trim();
      }
    });
  
    document.getElementById("scene-title").textContent = meta.title;
    document.getElementById("scene-text").innerHTML = marked.parse(markdown);
    const choices = document.getElementById("choices");
    choices.innerHTML = "";
    meta.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;
      btn.onclick = () => loadScene(choice.nextSceneId);
      choices.appendChild(btn);
    });
  }
  
  loadScene("scene-001");
  