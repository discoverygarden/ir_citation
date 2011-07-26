<?xml version="1.0" encoding="UTF-8"?>
<!-- $Id: demoFoxmlToLucene.xslt 5734 2006-11-28 11:20:15Z gertsp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" exclude-result-prefixes="exts islandora-exts"
	xmlns:exts="xalan://dk.defxws.fedoragsearch.server.GenericOperationsImpl" 
	xmlns:islandora-exts="xalan://ca.upei.roblib.DataStreamForXSLT" 
	xmlns:zs="http://www.loc.gov/zing/srw/" 
	xmlns:foxml="info:fedora/fedora-system:def/foxml#" 
	xmlns:dc="http://purl.org/dc/elements/1.1/" 
	xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" 
	xmlns:mods="http://www.loc.gov/mods/v3" 
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
	xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" 
	xmlns:fedora="info:fedora/fedora-system:def/relations-external#" 
	xmlns:rel="info:fedora/fedora-system:def/relations-external#" 
	xmlns:dwc="http://rs.tdwg.org/dwc/xsd/simpledarwincore/" 
	xmlns:fedora-model="info:fedora/fedora-system:def/model#" 
	xmlns:uvalibdesc="http://dl.lib.virginia.edu/bin/dtd/descmeta/descmeta.dtd" 
	xmlns:uvalibadmin="http://dl.lib.virginia.edu/bin/admin/admin.dtd/">
	<xsl:output method="xml" indent="yes" encoding="UTF-8"/>
	<!--
	 This xslt stylesheet generates the Solr doc element consisting of field elements
     from a FOXML record. The PID field is mandatory.
     Options for tailoring:
       - generation of fields from other XML metadata streams than DC
       - generation of fields from other datastream types than XML
         - from datastream by ID, text fetched, if mimetype can be handled
             currently the mimetypes text/plain, text/xml, text/html, application/pdf can be handled.
-->
	<xsl:param name="REPOSITORYNAME" select="repositoryName"/>
	<xsl:param name="FEDORASOAP" select="repositoryName"/>
	<xsl:param name="FEDORAUSER" select="repositoryName"/>
	<xsl:param name="FEDORAPASS" select="repositoryName"/>
	<xsl:param name="TRUSTSTOREPATH" select="repositoryName"/>
	<xsl:param name="TRUSTSTOREPASS" select="repositoryName"/>
	<xsl:variable name="PID" select="/foxml:digitalObject/@PID"/>
	<xsl:variable name="TYPE" select="//dc:type"/>
	<xsl:variable name="docBoost" select="1.4*2.5"/>
	<!-- or any other calculation, default boost is 1.0 -->
	<xsl:template match="/">
		<add>
			<doc>
				<xsl:attribute name="boost">
					<xsl:value-of select="$docBoost"/>
				</xsl:attribute>
				<!-- The following allows only active demo FedoraObjects to be indexed. -->
				<xsl:if test="foxml:digitalObject/foxml:objectProperties/foxml:property[@NAME='info:fedora/fedora-system:def/model#state' and @VALUE='Active']">
					<xsl:if test="not(foxml:digitalObject/foxml:datastream[@ID='METHODMAP'] or foxml:digitalObject/foxml:datastream[@ID='DS-COMPOSITE-MODEL'])">

							<xsl:apply-templates mode="activeDemoFedoraObject"/>

					</xsl:if>
				</xsl:if>
			</doc>
		</add>
	</xsl:template>
	<xsl:template match="/foxml:digitalObject" mode="activeDemoFedoraObject">
		<field name="PID" boost="2.5">
			<xsl:value-of select="$PID"/>
		</field>
		<xsl:for-each select="foxml:objectProperties/foxml:property">
			<field>
				<xsl:attribute name="name">
					<xsl:value-of select="concat('fgs.', substring-after(@NAME,'#'))"/>
				</xsl:attribute>
				<xsl:value-of select="@VALUE"/>
			</field>
		</xsl:for-each>
		<xsl:for-each select="foxml:datastream/foxml:datastreamVersion[last()]/foxml:xmlContent/oai_dc:dc/*">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('dc.', substring-after(name(),':'))"/>
					</xsl:attribute>
					<xsl:value-of select="normalize-space(text())"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		<xsl:for-each select="foxml:datastream/foxml:datastreamVersion[last()]/foxml:xmlContent/reference/*">
			<field>
				<xsl:attribute name="name">
					<xsl:value-of select="concat('refworks.', name())"/>
				</xsl:attribute>
				<xsl:value-of select="text()"/>
			</field>
		</xsl:for-each>
		<xsl:for-each select="foxml:datastream[@ID='RIGHTSMETADATA']/foxml:datastreamVersion[last()]/foxml:xmlContent//access/human/person">
			<field>
				<xsl:attribute name="name">access.person</xsl:attribute>
				<xsl:value-of select="text()"/>
			</field>
		</xsl:for-each>
		<xsl:for-each select="foxml:datastream[@ID='RIGHTSMETADATA']/foxml:datastreamVersion[last()]/foxml:xmlContent//access/human/group">
			<field>
				<xsl:attribute name="name">access.group</xsl:attribute>
				<xsl:value-of select="text()"/>
			</field>
		</xsl:for-each>
		<xsl:for-each select="foxml:datastream[@ID='TAGS']/foxml:datastreamVersion[last()]/foxml:xmlContent//tag">
			<!--<xsl:for-each select="foxml:datastream/foxml:datastreamVersion[last()]/foxml:xmlContent//tag">-->
			<field>
				<xsl:attribute name="name">tag</xsl:attribute>
				<xsl:value-of select="text()"/>
			</field>
			<field>
				<xsl:attribute name="name">tagUser</xsl:attribute>
				<xsl:value-of select="@creator"/>
			</field>
		</xsl:for-each>
		<xsl:for-each select="foxml:datastream[@ID='RELS-EXT']/foxml:datastreamVersion[last()]/foxml:xmlContent//rdf:description/*">
			<field>
				<xsl:attribute name="name">
					<xsl:value-of select="concat('rels.', substring-after(name(),':'))"/>
				</xsl:attribute>
				<xsl:value-of select="@rdf:resource"/>
			</field>
		</xsl:for-each>
		<!--*************************************************************full text************************************************************************************-->
		<!--  Filter added to ensure OCR streams for ilives books are NOT included -->
		<xsl:for-each select="foxml:datastream[@ID='OCR']/foxml:datastreamVersion[last()]">
			<xsl:if test="starts-with($PID,'ilives')=false">
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('OCR.', 'OCR')"/>
					</xsl:attribute>
					<xsl:value-of select="islandora-exts:getDatastreamTextRaw($PID, $REPOSITORYNAME, 'OCR', $FEDORASOAP, $FEDORAUSER, $FEDORAPASS, $TRUSTSTOREPATH, $TRUSTSTOREPASS)"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		<!--  Filter added to ensure OCR streams for ilives books are NOT included -->
		<xsl:for-each select="foxml:datastream[@ID='OBJ']/foxml:datastreamVersion[last()]">
			<xsl:if test="starts-with($PID,'ir')=true">
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('dsm.', 'text')"/>
					</xsl:attribute>
					<xsl:value-of select="islandora-exts:getDatastreamText($PID, $REPOSITORYNAME, 'OCR', $FEDORASOAP, $FEDORAUSER, $FEDORAPASS, $TRUSTSTOREPATH, $TRUSTSTOREPASS)"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		<!--***********************************************************end full text********************************************************************************-->
		<xsl:variable name="pageCModel">
			<xsl:text>info:fedora/ilives:pageCModel</xsl:text>
		</xsl:variable>
		<xsl:variable name="thisCModel">
			<xsl:value-of select="//fedora-model:hasModel/@rdf:resource"/>
		</xsl:variable>
		<xsl:value-of select="$thisCModel"/>
		<!--********************************************Darwin Core**********************************************************************-->
		<xsl:for-each select="foxml:datastream/foxml:datastreamVersion[last()]/foxml:xmlContent/dwc:SimpleDarwinRecordSet/dwc:SimpleDarwinRecord/*">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('dwc.', substring-after(name(),':'))"/>
					</xsl:attribute>
					<xsl:value-of select="normalize-space(text())"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!--***************************************** END Darwin Core ******************************************-->
		
		
		<!-- a managed datastream is fetched, if its mimetype 
			     can be handled, the text becomes the value of the field. -->
		<!--<xsl:for-each select="foxml:datastream[@CONTROL_GROUP='M']">
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('dsm.', @ID)"/>
					</xsl:attribute>
					<xsl:value-of select="exts:getDatastreamText($PID, $REPOSITORYNAME, @ID, $FEDORASOAP, $FEDORAUSER, $FEDORAPASS, $TRUSTSTOREPATH, $TRUSTSTOREPASS)"/>
				</field>
			</xsl:for-each>-->
		
		
		<!--************************************ BLAST ******************************************-->
		
		<!-- Blast -->
		<xsl:for-each select="foxml:datastream[@ID='BLAST']/foxml:datastreamVersion[last()]/foxml:xmlContent//Hit/Hit_hsps/Hsp/*">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('blast.', name())"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!--********************************** End BLAST ******************************************-->

		<!--************************************ MODS subset for Bibliographies ******************************************-->

		<!-- Main Title, with non-sorting prefixes -->
		<!-- ...specifically, this avoids catching relatedItem titles -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:mods/mods:titleInfo/mods:title">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'title')"/>
					</xsl:attribute>
					<xsl:if test="../mods:nonSort">
						<xsl:value-of select="../mods:nonSort/text()"/>
						<xsl:text> </xsl:text>						
					</xsl:if>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Sub-title -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:mods/mods:titleInfo/mods:subTitle">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'subTitle')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Abstract -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:mods//mods:abstract">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', name())"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Genre (a.k.a. specific doctype) -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:mods//mods:genre">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', name())"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
        <!--  Resource Type (a.k.a. broad doctype) -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:mods/mods:typeOfResource">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'resource_type')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- ISBN (hey, why not?) -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:mods/mods:identifier[@type='isbn']">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'isbn')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- DOI -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:mods/mods:identifier[@type='doi']">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'doi')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Names and Roles -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:roleTerm">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.name_', text())"/>
					</xsl:attribute>
					<xsl:for-each select="../../mods:namePart[@type='given']">
						<xsl:value-of select="text()"/>
						<xsl:if test="string-length(text())=1">
							<xsl:text>.</xsl:text>
						</xsl:if>
						<xsl:text> </xsl:text>
					</xsl:for-each>
					<xsl:for-each select="../../mods:namePart[not(@type='given')]">
						<xsl:value-of select="text()"/>
						<xsl:if test="position()!=last()">
							<xsl:text> </xsl:text>
						</xsl:if>
					</xsl:for-each>
				</field>
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.rname_', text())"/>
					</xsl:attribute>
					<xsl:for-each select="../../mods:namePart[not(@type='given')]">
						<xsl:value-of select="text()"/>
						<xsl:if test="@type='given'">
							<xsl:text> </xsl:text>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="../../mods:namePart[@type='given']">
						<xsl:if test="position()=1">
							<xsl:text>, </xsl:text>
						</xsl:if>
						<xsl:value-of select="text()"/>
						<xsl:if test="string-length(text())=1">
							<xsl:text>.</xsl:text>
						</xsl:if>
						<xsl:if test="position()!=last()">
							<xsl:text> </xsl:text>
						</xsl:if>
					</xsl:for-each>
				</field>
			</xsl:if>
		</xsl:for-each>

		<!-- Notes -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:note">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'note')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Subjects / Keywords -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:subject/*">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'subject')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Country -->
		<!-- Herein follows a bunch of MODS
			 stuff I didn't think was necessary for bibliographic
			 records.  But you might still want it for 
			 other MODS stuff.
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:country">
			<xsl:if test="text() [normalize-space(.) ]">
				<!-\-don't bother with empty space-\->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'country')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:province">
			<xsl:if test="text() [normalize-space(.) ]">
				<!-\-don't bother with empty space-\->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'province')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:county">
			<xsl:if test="text() [normalize-space(.) ]">
				<!-\-don't bother with empty space-\->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'county')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:region">
			<xsl:if test="text() [normalize-space(.) ]">
				<!-\-don't bother with empty space-\->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'county')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:city">
			<xsl:if test="text() [normalize-space(.) ]">
				<!-\-don't bother with empty space-\->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'county')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:citySection">
			<xsl:if test="text() [normalize-space(.) ]">
				<!-\-don't bother with empty space-\->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'county')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		-->
		
		<!-- Host Name (i.e. journal/newspaper name) -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:relatedItem[@type='host']/mods:titleInfo/mods:title">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'host_title')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Series Name (this means, e.g. a lecture series and is rarely used) -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:relatedItem[@type='series']/mods:titleInfo/mods:title">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'series_title')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Volume (e.g. journal vol) -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:mods/mods:part/mods:detail[@type='volume']/*">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'volume')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Issue (e.g. journal vol) -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:mods/mods:part/mods:detail[@type='issue']/*">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'issue')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Subject Names - not necessary for our MODS citations -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:subject/mods:name/mods:namePart/*">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'subject')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Physical Description - not necessary for our MODS citations -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:physicalDescription/*">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', name())"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Place of publication -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:originInfo/mods:place/mods:placeTerm[@type='text']">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', 'place_of_publication')"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Publisher's Name -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:originInfo/mods:publisher">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', name())"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Edition (Book) -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:originInfo/mods:edition">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', name())"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Date Issued (i.e. Journal Pub Date) -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:originInfo/mods:dateIssued">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', name())"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Copyright Date (is an okay substitute for Issued Date in many circumstances) -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:originInfo/mods:copyrightDate">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', name())"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
		
		<!-- Issuance (i.e. ongoing, monograph, etc. ) -->
		<xsl:for-each select="foxml:datastream[@ID='MODS']/foxml:datastreamVersion[last()]/foxml:xmlContent//mods:originInfo/mods:issuance">
			<xsl:if test="text() [normalize-space(.) ]">
				<!--don't bother with empty space-->
				<field>
					<xsl:attribute name="name">
						<xsl:value-of select="concat('mods.', name())"/>
					</xsl:attribute>
					<xsl:value-of select="text()"/>
				</field>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
