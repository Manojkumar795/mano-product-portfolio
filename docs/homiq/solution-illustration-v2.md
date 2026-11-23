# HOMIQ solution illustration, second edition

Tool: built-in image generation (image edit).

Source: `public/homiq/editorial/solution-home-watercolor.png`

Selected output: `public/homiq/editorial/solution-home-evening-v2.png`

## Final prompt

Use case: lighting-weather, with a precise object edit in the study. Edit target: supplied wide architectural watercolor cutaway home illustration. This is a careful refinement of an image the user loves. Preserve its exact panoramic composition, three room layout, warm timber architecture, furniture, plants, loose pen outlines, watercolor paper texture, generous blank paper above and below, and the original people and poses. Keep the main living room at left warmly illuminated; preserve the prominent curved floor lamp, phone-holding seated man, wall mounted air conditioner near the upper-right of the living room, and television. Change only these areas: (1) Upper-right bedroom is now a sleeping night scene: much darker desaturated indigo and blue-gray shadows, both bedside lamps switched OFF without any yellow glow, gentle cool moonlight from the window, sleeping person remains visible and serene, bedding/furniture clearly recognizable. Do not put a dark rectangle over the room; paint the shaded lighting naturally within the original watercolor. (2) Lower-right study is evening book reading: preserve the seated reader's pose and replace the open laptop with a clearly visible open paper book on the desk; a focused warm amber task lamp illuminates the book, with quieter cool blue evening ambient shadows in the rest of the study. Make the reading light visibly distinct from the living room's broad golden illumination. Preserve the desk, bookcase, window, chair, wall art and greenery. Everything else unchanged. No annotations, labels, words, arrows, UI overlays, invented displays, watermarks, new objects, or new people. Keep the original wide aspect ratio and high detail.

## Integration

Six callouts are drawn in code, outside the generated raster. Their endpoints target the phone, AC, unlit bedside lamp, living-room lamp, television and reading lamp. On narrow screens, numbered markers pair with a readable legend. Values illustrate existing HOMIQ control patterns; they are not live device telemetry.
