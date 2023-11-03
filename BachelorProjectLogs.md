# Diary of the Bachelor Project

## Propojení softwarových artefaktů 
(EN. Linking software artifacts)

Rostoucí velikost a složitost softwarových systémů vytváří potřebu snadné navigace a detekce souvisejících částí.
Dohledání využití komponenty, či deklarace funkce, je dnes již běžně dostupnou funkcionalitou.
Tato funkcionalita však může být rozšířena o propojení na datově sémantické úrovni.
Nové propojení by umožnilo provázat datové modely, specifikace, zdrojové kódy v různých jazycích, dokumentace, ale i další artefakty softwarového systému.
Základní myšlenkou je využití anotací umístěných v komentářích, které budou označovat významné části artefaktů.
Anotace mohou například popisovat vybrané datové entity a jejich vlastnosti.
Tuto informaci by následně bylo možné využít například pro analýzu kódu, konstrukci doménového modelu, či asistenci programátorům.
Zcela zásadní pro adopci tohoto přístupu, je však podpora ze strany softwarových nástrojů.
V rámci práce student navrhne a implementuje proof-of-concept řešení, které budou demonstrovat využití výše popsaného přístupu.
Součástí řešení bude rozšíření pro Visual Studio Code, které usnadní vývojáři tvorbu anotací.
Uživatel bude dále s pomocí řešení schopen anotovat datové entity a následně vizualizovat jejich vztahy napříč softwarovým systémem.

## Approximate sylabus of the Bc. work

~50 pages

- Related work 
	- Are there any similar extensions? 
	- If yes, what are they doing? 
	- What are their advantages and disadvantages? 
	- Comparing with some code helpers (copilot, lince, etc.), with ChatGPT. Compare with other tools for creating models (LinkML, etc.).
- Analyza 
	- What is the problem? What is the goal? 
	- What is the solution? What is the benefit?
- Design 
	- How to solve the problem? 
	- What is the architecture, design, model?
- implementace 
	- How to implement the solution? What is the implementation? What is the model? (programmers doc)
- User doc 
	- How to use the extension? 
	- How to install? 
	- How to configure? 
	- How to extend?
- ? Administators doc
	- How to install? 
	- How to configure?
- Evaluation 
	- Show the results of the extension. Use cases. Peoples reactions (interviews, etc.)
- Conclusion 
	- What is the result? What is the benefit? What is the future work?

# Logs

## 3.11.2023

New Use Case for NKOD: https://data.gov.cz/datové-sady

Feature to enhance your experience with NKOD or with smthing like that.

**For Analysts:** You can now easily create models and APIs by utilizing 
our *first* extension. This tool is designed to assist you in writing efficient
code, simplifying your work and increasing productivity.

**For Users:** Instead of navigating through web interfaces and conducting
extensive searches for APIs/models, you can now use our *secondary* extension.
This extension provides valuable suggestions directly in your code, making the
process of creating public models and APIs a breeze.

Furthermore, our extension is highly configurable, allowing users to tailor it
to their specific needs and preferences, thus enhancing the overall user
experience.

## Need to do

- [ ] Syntax extension suggestions, source suggestion
- [ ] Code snipets.
- [ ] Divide extension for creators and users.
- Napsat v cetvrtek a urcit den schuzce.

## 10.11.2023 (?)