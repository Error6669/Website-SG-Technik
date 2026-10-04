/*!
 * SG Technik – animiertes Logo (Intro + Salz-Silo-Loop)
 * Einbindung: <div class="sgt-logo"></div> + dieses Script.
 * Optionen per data-Attribut am <div>:
 *   data-intro="false"   Intro-Animation weglassen
 *   data-loop="false"    Salz-Loop weglassen (z. B. für das Logo in der Navigation)
 *   data-speed="0.8"     Tempo des Salz-Loops (Standard 1)
 * Größe: einfach die Breite des <div> per CSS setzen, die Höhe passt sich an.
 */
(function () {
  'use strict';
  var D = {"sg":["M195.69,156.11c0-.78-.19-1.41-.57-1.89-.38-.48-.9-.87-1.56-1.18-.66-.3-1.39-.55-2.21-.74-.82-.19-1.67-.38-2.57-.56-1.19-.26-2.33-.57-3.41-.93-1.08-.36-2.04-.85-2.86-1.49-.82-.63-1.48-1.44-1.97-2.41s-.73-2.2-.73-3.66c0-1.62.28-3.02.85-4.22.56-1.2,1.33-2.19,2.3-2.97.97-.79,2.1-1.37,3.41-1.76,1.3-.39,2.77-.58,4.4-.58s3.27.16,4.92.48c1.65.32,3.07.73,4.25,1.24v4.8c-1.59-.63-3.11-1.08-4.56-1.36-1.46-.28-2.83-.42-4.11-.42-1.84,0-3.27.34-4.27,1.01-1,.67-1.5,1.68-1.5,3.02,0,.78.16,1.42.49,1.92.33.5.77.92,1.34,1.25s1.21.59,1.94.79c.73.2,1.51.38,2.33.55,1.3.27,2.54.59,3.72.95s2.23.86,3.15,1.5,1.64,1.48,2.17,2.5c.53,1.03.8,2.34.8,3.95s-.3,3.07-.92,4.28c-.61,1.21-1.48,2.2-2.6,2.99-1.12.79-2.48,1.37-4.08,1.75-1.6.38-3.35.57-5.26.57-1.66,0-3.3-.16-4.91-.49s-2.95-.79-4.01-1.38v-4.74c1.51.66,2.98,1.13,4.42,1.43s2.91.45,4.44.45c.88,0,1.75-.07,2.61-.22.85-.15,1.62-.39,2.3-.74.68-.35,1.22-.83,1.64-1.43.41-.6.62-1.35.62-2.23Z","M225.54,153.2h-6.86v-4.69h12.47v15.44c-.46.17-1.04.34-1.75.53s-1.5.35-2.38.49c-.88.15-1.78.26-2.71.35-.93.09-1.85.14-2.77.14-2.75,0-5.14-.37-7.19-1.11-2.05-.74-3.76-1.78-5.12-3.12-1.37-1.34-2.39-2.94-3.07-4.79-.68-1.85-1.02-3.9-1.02-6.14,0-1.59.18-3.1.54-4.54.36-1.44.88-2.78,1.58-4,.69-1.23,1.54-2.34,2.53-3.33.99-.99,2.12-1.84,3.4-2.54s2.67-1.24,4.19-1.61,3.15-.56,4.88-.56c1.54,0,3,.11,4.39.33,1.39.22,2.52.49,3.41.81v4.76c-1.19-.38-2.39-.67-3.6-.87-1.21-.2-2.44-.3-3.67-.3-1.66,0-3.22.25-4.67.74-1.45.5-2.7,1.23-3.76,2.2-1.06.97-1.9,2.16-2.5,3.58-.61,1.42-.92,3.06-.92,4.92.01,3.61.96,6.33,2.84,8.13,1.88,1.81,4.54,2.71,7.98,2.71.64,0,1.3-.03,1.99-.1.69-.07,1.29-.16,1.81-.26v-7.16Z"],"tech":["M193.15,221.11h-5.6v-25.92h-9.88v-4.69h25.35v4.69h-9.86v25.92Z","M246.51,194.67c-1.52,0-2.93.25-4.22.75-1.29.5-2.39,1.24-3.32,2.2-.92.96-1.64,2.15-2.16,3.56s-.78,3.02-.78,4.84.24,3.38.71,4.75,1.15,2.5,2.04,3.42c.88.92,1.96,1.61,3.24,2.07,1.27.47,2.72.7,4.34.7,1.16,0,2.34-.09,3.55-.27s2.33-.45,3.39-.8v4.83c-1.07.31-2.22.55-3.45.72s-2.52.26-3.84.26c-2.59,0-4.87-.37-6.84-1.11-1.97-.74-3.61-1.78-4.93-3.13-1.32-1.35-2.31-2.97-2.97-4.85-.66-1.88-1-3.96-1-6.23s.36-4.5,1.06-6.5c.71-2,1.73-3.73,3.07-5.19,1.33-1.46,3-2.62,5.01-3.45,2-.84,4.27-1.27,6.8-1.28,1.3,0,2.52.09,3.68.26,1.16.18,2.2.42,3.13.74v4.76c-1.22-.38-2.36-.65-3.41-.8-1.05-.15-2.08-.23-3.09-.23Z","M263.44,203.11h14.18v-12.6h5.6v30.61h-5.6v-13.31h-14.18v13.31h-5.6v-30.61h5.6v12.6Z","M305.32,204.73c2.2,3.13,3.98,5.9,5.35,8.33h.14c-.18-3.98-.27-6.88-.27-8.69v-13.86h5.6v30.61h-5.88l-9.97-14.09c-1.75-2.44-3.57-5.27-5.44-8.49h-.14c.18,3.75.27,6.66.27,8.72v13.86h-5.6v-30.61h5.88l10.07,14.23Z","M322.29,221.11v-30.61h5.6v30.61h-5.6Z","M334.04,221.11v-30.61h5.6v13.93h.09l11.55-13.93h6.95l-12.76,15.17,13.82,15.44h-7.18l-12.38-13.82h-.09v13.82h-5.6Z"],"ring":"M177.87,398.41C81.06,386.03,6,303.12,6,203,6,94.38,94.38,6,203,6s189.95,81.52,196.58,184.2h6.01C398.96,84.21,310.64,0,203,0S0,91.07,0,203c0,103.43,77.75,189.03,177.87,201.45v-6.04Z","arc":["M194.58,405.54c.03-.39-.05-.71-.22-.96-.17-.25-.42-.46-.73-.64s-.67-.32-1.07-.44c-.4-.12-.82-.24-1.26-.36-.58-.17-1.13-.35-1.66-.57-.53-.21-.98-.49-1.37-.83-.39-.34-.69-.76-.9-1.26-.21-.5-.29-1.12-.25-1.85.05-.81.23-1.5.55-2.08s.73-1.05,1.23-1.41c.5-.36,1.09-.62,1.74-.77.66-.15,1.39-.21,2.2-.15s1.61.18,2.42.39c.8.21,1.49.46,2.07.75l-.15,2.4c-.77-.36-1.51-.63-2.22-.82s-1.38-.3-2.02-.34c-.91-.06-1.63.07-2.14.37-.52.3-.79.79-.84,1.46-.02.39.04.71.18.97s.35.48.62.66c.27.18.58.33.94.45.36.12.73.24,1.14.35.63.18,1.24.37,1.81.59.57.22,1.08.5,1.51.84.43.35.77.79,1,1.32.23.53.32,1.19.27,1.99-.05.82-.25,1.52-.59,2.1-.34.58-.8,1.05-1.38,1.41-.58.36-1.27.61-2.08.75-.8.14-1.68.18-2.62.12-.82-.05-1.63-.18-2.41-.4-.79-.21-1.43-.48-1.94-.81l.15-2.36c.73.37,1.44.66,2.14.85.7.19,1.43.31,2.18.36.44.03.87.02,1.3-.03.43-.05.81-.15,1.16-.3.35-.15.63-.37.85-.66.22-.29.35-.65.38-1.09Z","M201.35,410.06l.03-15.29h2.78s-.03,15.29-.03,15.29h-2.78Z","M210.86,394.63l.63,12.93,7.09-.35.11,2.34-9.87.48-.74-15.27,2.78-.14Z","M234.76,400.04c.14,1.16.11,2.24-.1,3.24-.21,1-.58,1.89-1.13,2.66s-1.24,1.41-2.11,1.9c-.86.5-1.88.82-3.04.96-1.16.14-2.22.08-3.18-.2-.96-.27-1.79-.72-2.51-1.34-.71-.62-1.29-1.39-1.73-2.31-.44-.92-.74-1.96-.88-3.12-.14-1.16-.11-2.24.1-3.24.21-1,.58-1.89,1.13-2.66s1.24-1.41,2.11-1.9c.86-.5,1.88-.82,3.04-.96,1.16-.14,2.22-.08,3.18.2.96.27,1.79.72,2.51,1.34.71.62,1.29,1.39,1.73,2.31.45.92.74,1.96.88,3.12ZM231.92,400.39c-.11-.92-.32-1.72-.63-2.38s-.69-1.2-1.15-1.62c-.45-.41-.97-.7-1.54-.86-.58-.16-1.19-.2-1.84-.12s-1.24.27-1.76.56c-.52.29-.95.7-1.29,1.21s-.58,1.12-.72,1.84c-.14.72-.15,1.54-.04,2.46s.32,1.72.63,2.38c.31.66.69,1.2,1.14,1.61.45.41.97.69,1.54.86.58.16,1.19.21,1.84.13s1.24-.27,1.76-.57c.52-.3.95-.7,1.29-1.21s.58-1.12.72-1.84c.14-.72.15-1.54.04-2.46Z","M238.02,400.07l4.91-.93.46,2.41-4.91.93-.46-2.41Z","M259.43,402.55c-.76.22-1.47.34-2.13.36-.65.02-1.25-.04-1.8-.19s-1.04-.38-1.48-.7c-.44-.31-.84-.7-1.18-1.16-.28-.37-.52-.79-.73-1.27-.21-.48-.4-1.03-.58-1.64l-2.45-8.66,2.67-.76,2.39,8.42c.29,1.04.65,1.82,1.06,2.34.46.57,1,.93,1.61,1.07.61.14,1.28.11,2-.1.72-.2,1.3-.53,1.75-.97.45-.44.72-1.02.81-1.76.08-.66-.02-1.5-.32-2.54l-2.38-8.42,2.67-.76,2.46,8.66c.17.62.3,1.18.37,1.7.07.52.09,1,.04,1.46-.05.57-.18,1.1-.4,1.6-.21.5-.52.96-.92,1.38-.4.42-.88.79-1.46,1.11-.57.33-1.24.6-2.01.81Z","M274.76,388.51c1.57,1.07,2.89,2.05,3.96,2.94l.06-.02c-.79-1.83-1.35-3.16-1.67-4.01l-2.46-6.47,2.6-.99,5.44,14.29-2.72,1.04-7.13-4.82c-1.25-.83-2.59-1.83-4.03-3l-.06.02c.75,1.72,1.31,3.06,1.68,4.02l2.46,6.47-2.6.99-5.44-14.29,2.72-1.04,7.19,4.87Z","M287.3,392.23l-6.65-13.76,3.61-1.75c.32-.15.65-.3.99-.44.34-.14.68-.26,1.01-.37.33-.11.66-.21.98-.29s.63-.14.91-.18c.84-.12,1.64-.11,2.39.01.75.13,1.45.37,2.09.73.64.36,1.22.83,1.73,1.4.52.58.96,1.25,1.34,2.04.36.74.61,1.47.76,2.2.15.73.19,1.44.11,2.13-.08.7-.27,1.37-.58,2.02-.31.65-.75,1.28-1.32,1.87-.47.5-1.05.98-1.73,1.45-.68.47-1.48.92-2.4,1.36l-3.25,1.57ZM289.82,388.42c1.46-.71,2.51-1.46,3.14-2.27.55-.72.85-1.51.89-2.38.04-.87-.2-1.85-.72-2.93-.27-.56-.58-1.04-.92-1.43s-.71-.71-1.12-.95c-.4-.24-.83-.41-1.28-.5s-.93-.12-1.42-.09c-.46.04-.95.14-1.46.3-.51.16-1.06.39-1.65.67l-1.1.53,4.61,9.55,1.03-.5Z","M311.23,374.34c-.2-.33-.45-.55-.74-.65-.29-.1-.61-.14-.96-.1-.36.04-.73.13-1.13.26-.39.13-.8.27-1.23.43-.57.2-1.13.36-1.68.49-.55.13-1.08.17-1.6.11-.51-.05-1-.23-1.46-.51-.46-.29-.88-.74-1.27-1.37-.42-.69-.67-1.36-.75-2.01-.08-.66-.01-1.28.19-1.86s.53-1.13.98-1.64c.45-.5,1.02-.97,1.71-1.39.69-.42,1.42-.78,2.2-1.07s1.49-.49,2.12-.58l1.26,2.04c-.83.15-1.59.35-2.28.61-.69.26-1.3.55-1.85.89-.78.48-1.29.99-1.54,1.54-.24.54-.19,1.1.16,1.67.2.33.44.56.71.69.27.13.57.19.89.18s.67-.06,1.03-.17c.36-.11.74-.23,1.13-.37.62-.22,1.22-.41,1.82-.56.59-.15,1.16-.21,1.72-.18.55.03,1.08.2,1.57.5s.95.79,1.37,1.47c.43.7.68,1.39.73,2.06.06.67-.05,1.32-.31,1.94-.27.63-.69,1.23-1.27,1.81-.58.58-1.27,1.12-2.07,1.61-.7.43-1.44.79-2.2,1.07s-1.45.43-2.06.46l-1.24-2.01c.81-.11,1.55-.29,2.24-.54.68-.25,1.35-.57,1.99-.96.37-.23.72-.49,1.04-.77.32-.28.58-.59.78-.91.2-.33.3-.67.32-1.03s-.09-.73-.32-1.11Z","M326.56,359.62c.69.94,1.19,1.9,1.49,2.88.31.98.41,1.94.32,2.87-.1.94-.4,1.84-.91,2.69-.51.86-1.24,1.63-2.19,2.32s-1.9,1.15-2.88,1.38c-.97.23-1.92.25-2.84.06-.92-.19-1.8-.58-2.64-1.17-.84-.59-1.6-1.35-2.29-2.29-.69-.94-1.19-1.9-1.5-2.88-.31-.98-.41-1.94-.32-2.87.09-.94.4-1.84.91-2.69s1.24-1.63,2.19-2.32c.95-.69,1.9-1.15,2.88-1.38.97-.23,1.92-.25,2.84-.05.92.19,1.8.58,2.64,1.17.84.59,1.61,1.35,2.29,2.29ZM324.25,361.32c-.55-.75-1.12-1.34-1.71-1.77-.59-.43-1.19-.71-1.79-.85-.6-.14-1.19-.14-1.77,0-.58.14-1.13.41-1.67.79-.53.39-.95.84-1.26,1.35-.31.51-.49,1.07-.54,1.68s.04,1.27.27,1.96.62,1.42,1.17,2.17,1.12,1.34,1.71,1.77c.6.43,1.19.71,1.79.84.59.14,1.18.13,1.77,0s1.14-.4,1.67-.79c.53-.39.95-.84,1.26-1.35.31-.51.49-1.07.54-1.68s-.04-1.26-.27-1.96-.62-1.42-1.17-2.17Z","M326.49,349.65l8.43,9.82,5.39-4.62,1.53,1.78-7.5,6.43-9.96-11.6,2.11-1.81Z","M345,350.38l5.32-5.23,1.64,1.67-7.3,7.18-10.72-10.9,7.01-6.89,1.64,1.67-5.03,4.94,2.77,2.82,4.32-4.25,1.64,1.67-4.32,4.24,3.02,3.07Z","M357.69,334.63l-3.76,4.3,1.95,3.69-1.95,2.23-7.53-14.6,1.67-1.91,15.47,5.54-1.94,2.21-3.91-1.45ZM349.99,331.72c.85,1.45,1.55,2.69,2.08,3.71l.68,1.29,2.58-2.95-1.37-.51c-1.09-.4-2.4-.93-3.95-1.57l-.03.03Z","M363.84,319.88c1.9.05,3.54.16,4.92.33l.04-.05c-1.65-1.11-2.85-1.93-3.58-2.47l-5.57-4.11,1.65-2.24,12.3,9.07-1.73,2.35-8.6-.2c-1.5-.02-3.17-.14-5.01-.34l-.04.05c1.56,1.04,2.76,1.86,3.58,2.47l5.57,4.11-1.65,2.24-12.3-9.07,1.73-2.35,8.68.2Z","M364.83,305.8l10.98,6.85,3.76-6.02,1.99,1.24-5.23,8.38-12.97-8.09,1.47-2.36Z","M384.11,295l-2.66,5.06,2.76,3.13-1.38,2.62-10.72-12.45,1.18-2.25,16.33,1.79-1.37,2.6-4.14-.5ZM375.94,293.96c1.17,1.21,2.13,2.26,2.89,3.12l.96,1.09,1.83-3.47-1.45-.17c-1.15-.14-2.55-.34-4.21-.61l-.02.04Z","M389.31,278.95l-1.34,3.13-2.15-.92,2.43-5.68,7.09,3.03c-.01.24-.04.54-.1.9-.05.36-.13.75-.24,1.18-.11.43-.23.86-.37,1.3-.14.44-.3.87-.48,1.29-.54,1.25-1.17,2.27-1.91,3.06-.74.79-1.55,1.36-2.43,1.72-.88.36-1.81.51-2.8.46-.98-.05-1.99-.3-3.02-.74-.73-.31-1.39-.69-1.98-1.14-.59-.45-1.1-.95-1.53-1.5s-.77-1.16-1.04-1.81-.43-1.33-.51-2.05c-.07-.72-.05-1.46.08-2.22.12-.77.36-1.54.69-2.34.3-.7.64-1.35,1.01-1.94.37-.59.72-1.05,1.04-1.39l2.19.93c-.41.47-.77.96-1.1,1.47-.33.51-.61,1.05-.85,1.62-.32.76-.51,1.52-.57,2.27-.05.76.04,1.47.28,2.15.24.67.62,1.29,1.15,1.84.53.56,1.23,1.02,2.08,1.38,1.66.7,3.09.8,4.29.3s2.13-1.54,2.8-3.11c.13-.29.24-.6.34-.93s.18-.62.23-.88l-3.29-1.41Z","M396.09,270.88l2.4-7.07,2.22.75-3.29,9.7-14.47-4.92,3.16-9.31,2.22.75-2.27,6.68,3.74,1.27,1.95-5.73,2.22.75-1.95,5.73,4.08,1.39Z","M395.98,250.78c1.78-.67,3.34-1.19,4.68-1.55l.02-.07c-1.95-.4-3.36-.71-4.24-.93l-6.71-1.7.68-2.69,14.82,3.75-.71,2.83-8.04,3.07c-1.39.54-2.98,1.07-4.77,1.58l-.02.07c1.84.37,3.26.68,4.25.94l6.71,1.7-.68,2.69-14.82-3.75.71-2.83,8.11-3.1Z","M396.94,229.97c.65.11,1.23.35,1.72.74.5.38.87.94,1.12,1.67h.04c.19-.34.41-.66.66-.93.25-.28.53-.5.84-.68.31-.17.65-.29,1.02-.36.37-.07.76-.06,1.19,0,.37.06.75.19,1.16.37.4.19.77.46,1.12.81.35.36.64.81.89,1.34.25.54.41,1.2.48,1.97.01.19.02.4.02.63,0,.23,0,.48-.03.75-.02.27-.05.57-.09.9s-.1.7-.17,1.11l-.72,4.35-15.08-2.51.87-5.2c.18-1.11.45-1.99.79-2.63.25-.48.54-.88.87-1.21.33-.33.68-.59,1.04-.77.37-.19.74-.31,1.13-.36.38-.05.76-.05,1.13,0ZM398.2,235.97c.13-.75.14-1.31.05-1.7-.11-.44-.29-.77-.57-1-.27-.23-.6-.37-.99-.43-.4-.07-.77-.02-1.12.12-.35.15-.63.45-.87.91-.09.19-.18.42-.25.68-.07.26-.14.59-.21.99l-.37,2.25,3.9.65.41-2.47ZM400.1,238.82l4.25.71.3-1.79c.08-.48.13-.89.17-1.24.03-.35.04-.65.02-.91-.02-.39-.08-.73-.18-1.01-.1-.28-.22-.51-.37-.69-.15-.19-.33-.33-.53-.43-.2-.1-.42-.17-.66-.21-.42-.07-.81-.02-1.16.16-.36.18-.65.5-.89.97-.1.21-.2.45-.27.74-.08.29-.16.66-.23,1.11l-.43,2.59Z","M405.49,218.07l-.5,5.69,3.75,1.82-.26,2.95-14.7-7.33.22-2.53,15.76-4.67-.26,2.93-4.01,1.14ZM397.56,220.27c1.55.67,2.84,1.26,3.87,1.76l1.31.64.34-3.91-1.4.4c-1.12.31-2.49.67-4.12,1.06v.04Z","M410.21,204.24c0,.79-.09,1.51-.25,2.14-.16.63-.39,1.19-.69,1.67s-.66.89-1.08,1.23c-.42.34-.9.61-1.44.81-.43.16-.9.28-1.42.35-.52.07-1.1.1-1.74.1l-9-.06.02-2.78,8.75.05c1.08,0,1.93-.12,2.54-.37.68-.28,1.17-.7,1.47-1.25.3-.55.46-1.2.46-1.95,0-.75-.14-1.4-.44-1.95-.3-.55-.79-.98-1.46-1.27-.61-.26-1.45-.39-2.53-.4l-8.75-.05.02-2.78,9,.06c.64,0,1.22.04,1.74.12s.99.2,1.41.37c.53.21,1.01.48,1.43.83.42.35.78.77,1.06,1.27.29.5.51,1.07.67,1.71.15.64.22,1.36.22,2.16Z"]};
  var NS = 'http://www.w3.org/2000/svg';
  var DARK = '#183a59', MID = '#788c9e', LIGHT = '#c7cfd6';
  var CH = [
    '263.14 266.34 178.32 342.7 93.69 266.34 93.69 82.93 76.34 82.93 76.34 273.05 76.34 273.15 178.34 363.31 280.5 273.05 263.14 266.34',
    '299.73 266.34 214.91 342.7 130.28 266.34 130.28 82.93 112.92 82.93 112.92 273.05 112.92 273.15 214.92 363.31 317.08 273.05 299.73 266.34',
    '336.31 266.34 251.49 342.7 166.86 266.34 166.86 82.93 149.51 82.93 149.51 273.05 149.51 273.15 251.51 363.31 353.66 273.05 336.31 266.34'
  ];
  var CF = [DARK, MID, LIGHT];
  var WOP = [0.16, 0.18, 0.26], EOP = [0.55, 0.6, 0.85], GOP = [0.7, 0.75, 0.95], DOP = [0.85, 0.9, 1.15];
  var RING_L = 2 * Math.PI * 201, CH_L = 470;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var uid = 0;
  // Abweichung vom Original: Der Schalter in der Kopfzeile kann die Animation
  // abstellen (Klasse fx-off-logo am <html>, Ereignis sg:fx). Dann steht das
  // fertige Logo still, bis die Seite neu geladen oder wieder eingeschaltet wird.
  function isOff() { return document.documentElement.classList.contains('fx-off-logo'); }
  var states = [];

  function lx(i) { return 85 + i * 36.58; }

  function build(el, intro) {
    var u = 'sgt' + (uid++) + '-', i, h = '';
    h += '<svg viewBox="0 0 410.21 410.07" xmlns="' + NS + '" role="img" aria-label="SG Technik – Silo- und Soleanlagenbau" style="display:block;width:100%;height:auto;overflow:visible">';
    h += '<defs>';
    h += '<mask id="' + u + 'mr" maskUnits="userSpaceOnUse" x="-20" y="-20" width="450" height="450"><circle class="sgt-mrc" cx="203" cy="203" r="201" fill="none" stroke="#fff" stroke-width="16" transform="rotate(97 203 203)" stroke-dasharray="' + RING_L + '" stroke-dashoffset="' + (intro ? RING_L : 0) + '"/></mask>';
    for (i = 0; i < 3; i++) {
      var x = lx(i);
      h += '<mask id="' + u + 'm' + i + '" maskUnits="userSpaceOnUse" x="0" y="0" width="410" height="410"><polyline class="sgt-ml" data-l="' + i + '" points="' + x + ',70 ' + x + ',269.7 ' + (x + 93.3) + ',353 ' + (x + 196) + ',261" fill="none" stroke="#fff" stroke-width="30" stroke-dasharray="' + CH_L + '" stroke-dashoffset="' + (intro ? CH_L : 0) + '"/></mask>';
      h += '<mask id="' + u + 'k' + i + '" maskUnits="userSpaceOnUse" x="0" y="0" width="410" height="410"><polygon fill="#fff" points="' + CH[i] + '"/></mask>';
      h += '<clipPath id="' + u + 'c' + i + '"><path class="sgt-f" data-l="' + i + '"/></clipPath>';
    }
    h += '</defs>';
    h += '<g class="sgt-ring" mask="url(#' + u + 'mr)" style="transform-box:view-box;transform-origin:203px 203px"><path fill="' + DARK + '" d="' + D.ring + '"/></g>';
    for (i = 2; i >= 0; i--) {
      h += '<g mask="url(#' + u + 'm' + i + ')"><polygon fill="' + CF[i] + '" points="' + CH[i] + '"/></g>';
      h += '<g mask="url(#' + u + 'k' + i + ')">' +
        '<path class="sgt-w" data-l="' + i + '" fill="#fff" fill-opacity="' + WOP[i] + '"/>' +
        '<g clip-path="url(#' + u + 'c' + i + ')"><g class="sgt-d" data-l="' + i + '"></g></g>' +
        '<path class="sgt-e" data-l="' + i + '" fill="none" stroke="#fff" stroke-opacity="' + EOP[i] + '" stroke-width="1.15" stroke-linejoin="round"/>' +
        '<g class="sgt-p" data-l="' + i + '"></g></g>';
    }
    var hid = intro ? ' opacity="0"' : '';
    h += '<g fill="' + DARK + '">';
    h += '<g class="sgt-sg"' + hid + '>' + D.sg.map(function (d) { return '<path d="' + d + '"/>'; }).join('') + '</g>';
    h += '<g class="sgt-tech">' + D.tech.map(function (d) { return '<path class="sgt-ltr"' + hid + ' d="' + d + '"/>'; }).join('');
    [190.58, 203.4, 216.22].forEach(function (y) { h += '<rect class="sgt-bar"' + hid + ' x="206.3" y="' + y + '" width="19.61" height="4.87"/>'; });
    h += '</g>';
    h += '<g class="sgt-arc">' + D.arc.map(function (d) { return '<path' + hid + ' d="' + d + '"/>'; }).join('') + '</g>';
    h += '</g></svg>';
    el.innerHTML = h;
    return el.firstChild;
  }

  function q(svg, sel, i) { return svg.querySelector(sel + '[data-l="' + i + '"]'); }

  function playIntro(svg, done) {
    if (!svg.animate) { revealAll(svg); done(); return; }
    var ease = 'cubic-bezier(.2,.7,.2,1)';
    function A(el, kf, o) { var opt = { fill: 'both', easing: ease }; for (var k in o) opt[k] = o[k]; return el.animate(kf, opt); }
    function show(el) { el.removeAttribute('opacity'); }
    A(svg.querySelector('.sgt-mrc'), [{ strokeDashoffset: RING_L }, { strokeDashoffset: 0 }], { duration: 1400, easing: 'cubic-bezier(.6,0,.2,1)' });
    A(svg.querySelector('.sgt-ring'), [{ transform: 'rotate(-40deg)' }, { transform: 'rotate(0deg)' }], { duration: 1400 });
    for (var i = 0; i < 3; i++) A(q(svg, '.sgt-ml', i), [{ strokeDashoffset: CH_L }, { strokeDashoffset: 0 }], { duration: 900, delay: 250 + i * 180, easing: 'cubic-bezier(.5,0,.2,1)' });
    var sg = svg.querySelector('.sgt-sg'); show(sg);
    A(sg, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 1100 });
    [].forEach.call(svg.querySelectorAll('.sgt-ltr'), function (e, i) { show(e); A(e, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 450, delay: 1250 + i * 60 }); });
    [].forEach.call(svg.querySelectorAll('.sgt-bar'), function (e, i) { show(e); A(e, [{ opacity: 0, transform: 'translateX(-40px)' }, { opacity: 1, transform: 'none' }], { duration: 550, delay: 1300 + i * 110, easing: 'cubic-bezier(.3,1.4,.5,1)' }); });
    var last;
    [].forEach.call(svg.querySelectorAll('.sgt-arc path'), function (e, i) { show(e); last = A(e, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 1500 + i * 40 }); });
    last.onfinish = done;
  }

  function revealAll(svg) {
    [].forEach.call(svg.querySelectorAll('[opacity="0"]'), function (e) { e.removeAttribute('opacity'); });
    svg.querySelector('.sgt-mrc').setAttribute('stroke-dashoffset', 0);
    [].forEach.call(svg.querySelectorAll('.sgt-ml'), function (e) { e.setAttribute('stroke-dashoffset', 0); });
  }

  /* ---------- Salz-Silo-Loop ---------- */
  var LA = 187.7, LB = 125.07, DX = 0.746, DY = 0.666, PX = -0.666, PY = 0.746, G = 520, VMAX = 330;
  var W = 17.35, YB = 368, YC = 270, YT = 364 - 280.4 / 6, TOT = (YB - YT) * 2 * W;
  var RATE = 45, FILLT = 3.4, DRAINT = 5.5, GV = TOT / (RATE * FILLT), STEP = 2.5, SP = 2.4;
  var CHP = CH.map(function (s) { var n = s.split(' ').map(Number), p = []; for (var k = 0; k < n.length; k += 2) p.push([n[k], n[k + 1]]); return p; });

  function inPoly(x, y, p) {
    var c = false;
    for (var a = 0, b = p.length - 1; a < p.length; b = a++) {
      if ((p[a][1] > y) !== (p[b][1] > y) && x < (p[b][0] - p[a][0]) * (y - p[a][1]) / (p[b][1] - p[a][1]) + p[a][0]) c = !c;
    }
    return c;
  }
  function rnd(s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  function mk(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }

  function Salt(svg, speed) {
    var dead = false;
    var lanes = [0, 1, 2].map(function (i) {
      var x0 = lx(i), R = rnd(4321 + i * 777), pool = [], g = q(svg, '.sgt-p', i), dg = q(svg, '.sgt-d', i), k;
      for (k = 0; k < 140; k++) { var c = mk('circle', { r: 0, fill: '#fff' }); g.appendChild(c); pool.push({ c: c, a: 0 }); }
      // Abweichung vom Original: Die ruhenden Körner (rund 460 je Kammer) stehen
      // nicht als einzelne <circle>, sondern als wenige Pfade, je Deckkraftstufe
      // einer. Gleiches Bild, aber der Browser muss nicht in jedem Bild hunderte
      // Elemente durchgehen — auf schwachen Rechnern ruckelte das Logo sonst.
      var buckets = {};
      for (var y = YT - 12; y < 368; y += SP * 0.87) {
        for (var x = x0 + 18; x < x0 + 178; x += SP) {
          var cx = x + (R() - 0.5) * SP * 0.9 + ((y / SP | 0) % 2) * SP / 2, cy = y + (R() - 0.5) * SP * 0.8;
          var rr = 0.38 + R() * 0.42, op = Math.min(1, (0.4 + R() * 0.4) * DOP[i]);
          if (!inPoly(cx, cy, CHP[i])) continue;
          var key = (Math.round(op * 20) / 20).toFixed(2), r2 = rr.toFixed(2);
          buckets[key] = (buckets[key] || '') + 'M' + (cx - rr).toFixed(2) + ',' + cy.toFixed(1) + 'a' + r2 + ',' + r2 + ' 0 1,0 ' + (2 * rr).toFixed(2) + ',0a' + r2 + ',' + r2 + ' 0 1,0 ' + (-2 * rr).toFixed(2) + ',0';
        }
      }
      for (var b in buckets) dg.appendChild(mk('path', { d: buckets[b], fill: '#fff', opacity: b }));
      var xs = [], hh = [], j = [];
      for (var xx = x0 + 18; xx <= x0 + 178; xx += STEP) { xs.push(xx); hh.push(0); j.push((R() - 0.5) * 1.4); }
      return { i: i, x: x0, pool: pool, acc: 0, level: YB, st: 'wait', tt: -i * 1.2, f: q(svg, '.sgt-f', i), w: q(svg, '.sgt-w', i), e: q(svg, '.sgt-e', i), xs: xs, h: hh, j: j, ph: R() * 6, vx: x0 + 93.3 };
    });

    function spawn(L) {
      for (var k = 0; k < L.pool.length; k++) {
        var p = L.pool[k];
        if (!p.a) { p.a = 1; p.s = 0; p.v = 15 + Math.random() * 45; p.o = (Math.random() - 0.5) * 12; p.hit = 0; p.c.setAttribute('r', (0.6 + Math.random() * 0.9).toFixed(2)); return; }
      }
    }
    function surf(L, k) { return L.level - L.h[k] + L.j[k] + 1.1 * Math.sin(L.xs[k] * 0.33 + L.ph) + 0.7 * Math.sin(L.xs[k] * 0.91 + L.ph * 2); }
    function draw(L) {
      var top = '';
      for (var k = 0; k < L.xs.length; k++) top += (k ? ' L' : 'M') + L.xs[k].toFixed(1) + ',' + Math.min(372, surf(L, k)).toFixed(1);
      var d = 'M' + L.xs[0] + ',372 L' + top.slice(1) + ' L' + L.xs[L.xs.length - 1] + ',372Z';
      L.f.setAttribute('d', d); L.w.setAttribute('d', d); L.e.setAttribute('d', L.level >= YB - 1 ? '' : top);
    }
    function relax(L) {
      var h = L.h, lim = 1.2;
      for (var it = 0; it < 2; it++) for (var k = 0; k < h.length - 1; k++) {
        var df = h[k] - h[k + 1];
        if (Math.abs(df) > lim) { var m = (Math.abs(df) - lim) * 0.25 * (df > 0 ? 1 : -1); h[k] -= m; h[k + 1] += m; }
      }
    }
    function step(L, dt) {
      var k;
      L.tt += dt;
      if (L.st === 'wait' && L.tt >= 0) { L.st = 'fill'; L.tt = 0; }
      if (L.st === 'fill') {
        L.acc += RATE * dt * Math.min(1, L.tt / 0.5);
        while (L.acc >= 1) { spawn(L); L.acc--; }
        if (L.level <= YT) { L.level = YT; L.st = 'hold'; L.tt = 0; }
      } else if (L.st === 'hold') {
        if (L.tt > 1.2) { L.st = 'drain'; L.tt = 0; }
      } else if (L.st === 'drain') {
        var e = Math.min(1, L.tt / 1.2);
        L.level += e * TOT / DRAINT * dt / (2 * W);
        for (k = 0; k < L.h.length; k++) { var dx = L.xs[k] - L.vx; L.h[k] = Math.max(-6, L.h[k] - e * dt * 2.6 * Math.exp(-dx * dx / 500)); }
        if (L.level >= YB + 4) { L.level = YB; L.st = 'pause'; L.tt = 0; }
      } else if (L.st === 'pause') {
        for (k = 0; k < L.h.length; k++) L.h[k] *= Math.max(0, 1 - dt * 3);
        if (L.tt > 1.2) { L.st = 'fill'; L.tt = 0; }
      }
      relax(L);
      for (var n = 0; n < L.pool.length; n++) {
        var p = L.pool[n];
        if (!p.a) continue;
        if (p.s < LA) p.v = Math.min(p.v + G * dt, VMAX);
        else { if (!p.hit) { p.hit = 1; p.v *= 0.35; p.o *= 0.6; } p.v = Math.min(p.v + G * 0.35 * dt, VMAX * 0.55); }
        p.s += p.v * dt;
        p.o = Math.max(-6.5, Math.min(6.5, p.o + (Math.random() - 0.5) * dt * (p.hit ? 30 : 12)));
        var x, y;
        if (p.s < LA) { x = L.x + p.o; y = 82 + p.s; }
        else { var d = p.s - LA; x = L.x + DX * d + PX * p.o; y = 269.7 + DY * d + PY * p.o; }
        k = Math.max(0, Math.min(L.h.length - 1, Math.round((x - L.xs[0]) / STEP)));
        if (y >= surf(L, k) - 0.5 || p.s >= LA + LB) {
          p.a = 0; p.c.setAttribute('r', 0);
          if (L.st === 'fill' || L.st === 'hold') {
            L.level = Math.max(YT, L.level - GV / (2 * W) * 0.75);
            for (var o = -3; o <= 3; o++) { var kk = k + o; if (kk >= 0 && kk < L.h.length) L.h[kk] += 0.5 * Math.exp(-o * o / 3) * (0.6 + Math.random() * 0.8); }
          }
          continue;
        }
        p.c.setAttribute('cx', x.toFixed(1)); p.c.setAttribute('cy', y.toFixed(1));
        p.c.setAttribute('opacity', (GOP[L.i] * Math.min(1, p.s / 12)).toFixed(2));
      }
      for (k = 0; k < L.h.length; k++) L.h[k] = Math.min(8, L.h[k]);
      draw(L);
    }

    lanes.forEach(draw);
    var raf = 0, last = 0, visible = true;
    function frame(now) {
      var dt = Math.min((now - last) / 1000, 0.05) * speed; last = now;
      lanes.forEach(function (L) { step(L, dt); });
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf && !dead) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? start() : stop(); });
      io.observe(svg);
    }
    function onVisibility() { document.hidden ? stop() : (visible && start()); }
    document.addEventListener('visibilitychange', onVisibility);
    // Abweichung vom ursprünglichen Prototyp: Während gescrollt
    // wird, ruht der Loop. Er baut in jedem Bild Pfade und Körner des SVG neu auf;
    // das nimmt der scrollgekoppelten Winterdienst-Straße auf der Startseite die
    // Rechenzeit und ließ sie ruckeln, solange das Logo im Bild war.
    var idle = 0;
    function onScroll() {
      stop();
      clearTimeout(idle);
      idle = setTimeout(function () { if (visible && !document.hidden) start(); }, 180);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    start();
    // Beendet den Loop endgültig (Animation per Schalter abgestellt).
    return function () {
      dead = true;
      stop();
      clearTimeout(idle);
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('scroll', onScroll);
    };
  }

  // Baut den Loop an einer ruhigen Stelle auf, sofern das SVG bis dahin nicht
  // ersetzt und die Animation nicht abgestellt wurde.
  function startLoop(st) {
    var svg = st.svg;
    var later = window.requestIdleCallback || function (f) { setTimeout(f, 50); };
    later(function () { if (st.svg === svg && !isOff()) st.salt = Salt(svg, st.speed); }, { timeout: 600 });
  }

  function init(el) {
    if (el.getAttribute('data-sgt-ready')) return;
    el.setAttribute('data-sgt-ready', '1');
    var intro = !reduce && !isOff() && el.getAttribute('data-intro') !== 'false';
    var loop = !reduce && el.getAttribute('data-loop') !== 'false';
    var speed = parseFloat(el.getAttribute('data-speed')) || 1;
    var svg = build(el, intro);
    var st = { el: el, svg: svg, loop: loop, speed: speed, salt: null, io: null };
    states.push(st);
    // Abweichung vom Original: Der Aufbau des Loops wartet auf eine ruhige
    // Stelle, statt direkt im letzten Bild des Intros zu laufen. Danach erfährt
    // die Seite per Ereignis, dass das Intro durch ist (die Winterdienst-Straße
    // wartet darauf mit ihrem Aufbau).
    var go = function () {
      if (st.svg !== svg) return; // inzwischen per Schalter ersetzt
      if (intro) document.dispatchEvent(new Event('sgt:intro-done'));
      if (loop && !isOff()) startLoop(st);
    };
    if (!intro) { go(); return; }
    if ('IntersectionObserver' in window) {
      var io = st.io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { io.disconnect(); st.io = null; playIntro(svg, go); }
      }, { threshold: 0.3 });
      io.observe(el);
    } else playIntro(svg, go);
  }

  // Schalter in der Kopfzeile: Aus ersetzt jedes Logo durch das fertige,
  // stehende Bild (laufendes Intro und Loop enden damit). An startet den Loop
  // wieder, das Intro wird nicht wiederholt.
  function setAnimated(on) {
    states.forEach(function (st) {
      if (st.salt) { st.salt(); st.salt = null; }
      if (st.io) { st.io.disconnect(); st.io = null; }
      st.svg = build(st.el, false);
      if (on && st.loop) startLoop(st);
    });
    // Wer auf das Ende des Intros wartet (Winterdienst-Straße), muss nicht länger warten.
    if (!on) document.dispatchEvent(new Event('sgt:intro-done'));
  }
  document.addEventListener('sg:fx', function (e) {
    if (e.detail && e.detail.name === 'logo' && !reduce) setAnimated(e.detail.on);
  });

  function initAll() { [].forEach.call(document.querySelectorAll('.sgt-logo'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll); else initAll();
  window.SGTechnikLogo = { init: initAll };
})();
