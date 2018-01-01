package com.cmpe451.interesthub.activities;

import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.cmpe451.interesthub.InterestHub;
import com.cmpe451.interesthub.R;
import com.cmpe451.interesthub.adapters.TemplateListAdapter;
import com.cmpe451.interesthub.models.CheckboxItems;
import com.cmpe451.interesthub.models.Component;
import com.cmpe451.interesthub.models.Content;
import com.cmpe451.interesthub.models.ContentType;
import com.cmpe451.interesthub.models.DropdownItems;
import com.cmpe451.interesthub.models.Message;
import com.cmpe451.interesthub.models.SingleCheckboxItems;
import com.cmpe451.interesthub.models.SingleDropdownItems;
import com.cmpe451.interesthub.models.Tag;
import com.cmpe451.interesthub.models.TypeData;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class NewContent extends AppCompatActivity {


    public final int PICK_PHOTO_FOR_CONTENT = 5;
    Long groupId;
    String groupName;
    RecyclerView templateList ;
    RelativeLayout template;
    List<ContentType> Clist;
    List< MultipartBody.Part> uploadedimageList = new ArrayList< MultipartBody.Part>();
    InterestHub hub;
    Button clickedButton = null;
    Content sendContent;
    List<String> names = new ArrayList<String>();
    List<String> fields = new ArrayList<String>();
    List<String> values = new ArrayList<String>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_content);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        hub = (InterestHub) getApplication();
        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setVisibility(View.INVISIBLE);
        /*fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });
        */
        template = (RelativeLayout) findViewById(R.id.template_base);
        Clist = new ArrayList<ContentType>();
        groupId = getIntent().getExtras().getLong("groupId");
        groupName = getIntent().getExtras().getString("groupName");
        setTitle("Post on " + groupName);
        templateList = (RecyclerView) findViewById(R.id.content_list_layout);
        InterestHub hub = (InterestHub) getApplication();
        String tagUrl = "https://limitless-sands-55256.herokuapp.com/https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&continue=0&search=";
        hub.getApiService().getGroupContentTypes(groupId).enqueue(new Callback<List<ContentType>>() {
            @Override
            public void onResponse(Call<List<ContentType>> call, Response<List<ContentType>> response) {
                List<String> list = new ArrayList<String>();
                for(ContentType c : response.body()){
                    list.add(c.getName());
                    Clist.add(c);
                }
                setTemplateList(list);
            }

            @Override
            public void onFailure(Call<List<ContentType>> call, Throwable t) {

            }
        });


    }

    public void setTemplateList(List<String> list){
        TemplateListAdapter.OnItemClickListener listener = new TemplateListAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(int pos) {
                Log.d("clicked", String.valueOf(pos));
                if(pos< Clist.size())
                    changeLayout(pos);
                else
                    newTemplate();
            }
        };
        TemplateListAdapter adapter = new TemplateListAdapter(list,listener);
        final LinearLayoutManager ll = new LinearLayoutManager(this);
        ll.setOrientation(LinearLayoutManager.HORIZONTAL);
        templateList.setLayoutManager(ll);
        templateList.setAdapter(adapter);



    }

    private void newTemplate() {
         names = new ArrayList<String>();
        fields = new ArrayList<String>();
        values = new ArrayList<String>();
        template.removeAllViews();
        final LinearLayout l = (LinearLayout) getLayoutInflater().inflate(R.layout.template_creation_layout,null);
        final LinearLayout rowHolder = l.findViewById(R.id.template_row);
        /*
        LinearLayout singleRow = (LinearLayout) getLayoutInflater().inflate(R.layout.template_creation_row,null);
        Spinner spinner = (Spinner) singleRow.findViewById(R.id.template_component_spinner);
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.template_components, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);
        rowHolder.addView(singleRow);
        */
        Button button = l.findViewById(R.id.template_add_row_button);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(final View view) {
               /* LinearLayout singleRow = (LinearLayout) getLayoutInflater().inflate(R.layout.template_creation_row,null);
                rowHolder.addView(singleRow);
                final Spinner spinner = (Spinner) singleRow.findViewById(R.id.template_component_spinner);
                ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(getBaseContext(),
                        R.array.template_components, android.R.layout.simple_spinner_item);
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                spinner.setAdapter(adapter);
                if(singleRow.getParent()!=null) ((ViewGroup)singleRow.getParent()).removeView(singleRow);
                rowHolder.addView(singleRow);

                */
                AlertDialog.Builder alertDialog = new AlertDialog.Builder(NewContent.this);
                alertDialog.setTitle("Field Type");

                final Spinner spinner = new Spinner(NewContent.this);
                LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.MATCH_PARENT);
                spinner.setLayoutParams(lp);
                ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(getBaseContext(),
                        R.array.template_components, android.R.layout.simple_spinner_item);
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                spinner.setAdapter(adapter);
                alertDialog.setView(spinner);

                alertDialog.setPositiveButton("Next",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                spinner.getSelectedItem().toString();
                                if(spinner.getSelectedItem().toString().equals("Dropdown")){
                                    createField(spinner.getSelectedItem().toString(),rowHolder).show();
                                }
                                else if(spinner.getSelectedItem().toString().equals("Checkbox")){
                                    createField(spinner.getSelectedItem().toString(),rowHolder).show();
                                }
                                else{
                                    createField(spinner.getSelectedItem().toString(),rowHolder).show();
                                }

                            }
                        });

                alertDialog.setNegativeButton("Cancel",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.cancel();
                            }
                        });

                alertDialog.show();

            }
        });
        final Button button2 = l.findViewById(R.id.template_create);
        button2.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                for(int i =0 ;i<names.size();i++){
                    Log.d("name",names.get(i));
                    Log.d("type",fields.get(i));
                    Log.d("value",values.get(i));

                }
                button2.setEnabled(false);
                ContentType newContentType = new ContentType();
                newContentType.setName(((EditText)l.findViewById(R.id.template_name)).getText().toString());

                newContentType.setComponent_names(names);
                newContentType.setComponents(fields);
                List<CheckboxItems> checkboxlist = new ArrayList<CheckboxItems>();
                for(int i=0;i<fields.size();i++){
                    if(fields.get(i).equals("checkbox")) {
                        CheckboxItems checkbox = new CheckboxItems();
                        checkbox.setName(names.get(i));
                        String[] items = values.get(i).split(",");
                        List<SingleCheckboxItems> list = new ArrayList<SingleCheckboxItems>();
                        for(String item:items){
                            SingleCheckboxItems ss = new SingleCheckboxItems();
                            ss.setTitle(item.trim());
                            list.add(ss);
                        }
                        checkbox.setItems(list);
                        checkboxlist.add(checkbox);

                    }
                }
                newContentType.setCheckboxes(checkboxlist);
                List<DropdownItems> dropdownlist = new ArrayList<DropdownItems>();

                for(int i=0;i<fields.size();i++){
                    if(fields.get(i).equals("dropdown")) {
                        DropdownItems dropdown = new DropdownItems();
                        dropdown.setName(names.get(i));
                        String[] items = values.get(i).split(",");
                        List<SingleDropdownItems> list = new ArrayList<SingleDropdownItems>();
                        for(String item:items){
                            SingleDropdownItems ss = new SingleDropdownItems();
                            ss.setTitle(item.trim());
                            list.add(ss);
                        }
                        dropdown.setItems(list);
                        dropdownlist.add(dropdown);

                    }
                }
                newContentType.setDropdowns(dropdownlist);

                Gson gson = new Gson();
                newContentType.setId(null);
                String json = gson.toJson(newContentType);
                Log.d("json" ,json);

                RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json);
                hub.getApiService().postNewTemplate(groupId,requestBody).enqueue(new Callback<ContentType>() {
                    @Override
                    public void onResponse(Call<ContentType> call, Response<ContentType> response) {
                        Toast toast =  Toast.makeText(getBaseContext(),"New Template Created",Toast.LENGTH_SHORT);
                        toast.show();
                        finish();
                        startActivity(getIntent());
                    }

                    @Override
                    public void onFailure(Call<ContentType> call, Throwable t) {
                        Toast toast =  Toast.makeText(getBaseContext(),"New Template Failed",Toast.LENGTH_LONG);
                        toast.show();
                        button2.setEnabled(true);
                    }
                });


            }
        });
        Toolbar.LayoutParams param = new Toolbar.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        l.setLayoutParams(param);



        template.addView(l);
    }

    public void changeLayout(int pos){
        uploadedimageList.clear();
        template.removeAllViews();
        final LinearLayout lay = new LinearLayout(getBaseContext());
        Toolbar.LayoutParams param = new Toolbar.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        lay.setLayoutParams(param);
        final ContentType c = Clist.get(pos);
        lay.setOrientation(LinearLayout.VERTICAL);
        int dropdowncount=0,checkboxcount=0;
        for(int i=0;i<c.getComponent_names().size();i++){
            String s = c.getComponent_names().get(i);
            LinearLayout l = new LinearLayout(getBaseContext());
            l.setOrientation(LinearLayout.HORIZONTAL);
            TextView t = new TextView(getBaseContext());
            Toolbar.LayoutParams par = new Toolbar.LayoutParams(150, ViewGroup.LayoutParams.WRAP_CONTENT);

            t.setLayoutParams(par);
            t.setText(s);
            l.addView(t);
            if(c.getComponents().get(i).equals("image")) {
                Button button = new Button(getBaseContext());
                button.setOnClickListener(new View.OnClickListener() {

                    @Override
                    public void onClick(View v) {
                        pickImage();
                        clickedButton = (Button) v;
                    }
                });
                Toolbar.LayoutParams ll = new Toolbar.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                button.setLayoutParams(ll);
                button.setText("Choose Image");
                l.addView(button);

            }
            else if(c.getComponents().get(i).equals("dropdown")){
                Spinner spinner = new Spinner(getBaseContext());
                List<String> items = new ArrayList<>();
                for(SingleDropdownItems single: c.getDropdowns().get(dropdowncount++).getItems())
                    items.add(single.getTitle());
                ArrayAdapter adapter = new ArrayAdapter(getBaseContext(),android.R.layout.simple_spinner_item,items);
                spinner.setAdapter(adapter);
                spinner.setGravity(Gravity.RIGHT);
                Toolbar.LayoutParams ll = new Toolbar.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                spinner.setLayoutParams(ll);
                l.addView(spinner);
            }
            else if(c.getComponents().get(i).equals("checkbox")){
                LinearLayout linear = new LinearLayout(getBaseContext());
                linear.setOrientation(LinearLayout.VERTICAL);


                List<String> items = new ArrayList<>();
                for(SingleCheckboxItems single: c.getCheckboxes().get(checkboxcount++).getItems()){
                    CheckBox checkbox = new CheckBox(getBaseContext());
                    checkbox.setText(single.getTitle());
                    checkbox.setChecked(false);
                    checkbox.setGravity(Gravity.RIGHT);
                    linear.addView(checkbox);

                }

                Toolbar.LayoutParams ll = new Toolbar.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                linear.setLayoutParams(ll);
                l.addView(linear);
            }
            else{
                EditText e = new EditText(getBaseContext());
                Toolbar.LayoutParams ll = new Toolbar.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                e.setLayoutParams(ll);
                l.addView(e);
            }
            lay.addView(l);
        }
        Button b = new Button(getBaseContext());
        b.setText("Post");
        b.setGravity(Gravity.CENTER);
        b.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Content content  = new Content();
                content.setContentType(c);
                content.setOwner(hub.getSessionController().getUser());
                content.setContent_type_id(c.getId());
                content.setOwner_id(content.getOwner().getId());
                List<Component> clist = new ArrayList<Component>();
                int dropdowncount=0,checkboxcount=0;
                for(int i =0 ; i<c.getComponents().size(); i++){
                    EditText text = null;
                    Component comp = new Component();
                    if(c.getComponents().get(i).equals("text")) {
                        text = (EditText) ((LinearLayout) lay.getChildAt(i)).getChildAt(1);
                        comp.setComponent_type(c.getComponents().get(i));
                        comp.setOrder(i + 1);
                        TypeData t = new TypeData();
                        t.setData(text.getText().toString());
                        comp.setType_data(t);
                    }
                    else if(c.getComponents().get(i).equals("image")){
                        comp.setComponent_type(c.getComponents().get(i));
                        comp.setOrder(i + 1);
                        TypeData t = new TypeData();
                        comp.setType_data(t);
                    }
                    else if(c.getComponents().get(i).equals("dropdown")){
                        comp.setComponent_type(c.getComponents().get(i));
                        comp.setOrder(i + 1);
                        TypeData t = new TypeData();
                        Spinner spinner = (Spinner) ((LinearLayout) lay.getChildAt(i)).getChildAt(1);
                        t.setData("spinner");
                        String spinnerText = spinner.getSelectedItem().toString();
                        for(SingleDropdownItems s: c.getDropdowns().get(dropdowncount).getItems())
                            if(s.getTitle().equals(spinnerText))
                                t.setSelected(s.getId());
                        dropdowncount++;
                        comp.setType_data(t);
                    }
                    else if(c.getComponents().get(i).equals("checkbox")){
                        comp.setComponent_type(c.getComponents().get(i));
                        comp.setOrder(i + 1);
                        TypeData t = new TypeData();
                        t.setData("checkbox");
                        List<Long> selectedscb = new ArrayList<Long>();
                        LinearLayout clayout = (LinearLayout) ((LinearLayout) lay.getChildAt(i)).getChildAt(1);
                        for(int it = 0;it<clayout.getChildCount();it++){
                            CheckBox cb = (CheckBox) clayout.getChildAt(it);
                            if(cb.isChecked()){
                                for(SingleCheckboxItems scb:c.getCheckboxes().get(checkboxcount).getItems()){
                                    if(scb.getTitle().equals(cb.getText().toString()))
                                        selectedscb.add(scb.getId());
                                }
                            }
                        }
                        t.setSelecteds(selectedscb);
                        checkboxcount++;

                        comp.setType_data(t);
                    }
                    else if(c.getComponents().get(i).equals("longtext")) {
                        text = (EditText) ((LinearLayout) lay.getChildAt(i)).getChildAt(1);
                        comp.setComponent_type(c.getComponents().get(i));
                        comp.setOrder(i + 1);
                        TypeData t = new TypeData();
                        t.setData(text.getText().toString());
                        comp.setType_data(t);
                    }
                    else if(c.getComponents().get(i).equals("number")) {
                        text = (EditText) ((LinearLayout) lay.getChildAt(i)).getChildAt(1);
                        comp.setComponent_type(c.getComponents().get(i));
                        comp.setOrder(i + 1);
                        TypeData t = new TypeData();
                        t.setData(text.getText().toString());
                        comp.setType_data(t);
                    }
                    else if(c.getComponents().get(i).equals("title")) {
                        text = (EditText) ((LinearLayout) lay.getChildAt(i)).getChildAt(1);
                        comp.setComponent_type(c.getComponents().get(i));
                        comp.setOrder(i + 1);
                        TypeData t = new TypeData();
                        t.setData(text.getText().toString());
                        comp.setType_data(t);
                    }
                    else if(c.getComponents().get(i).equals("video")) {
                        text = (EditText) ((LinearLayout) lay.getChildAt(i)).getChildAt(1);
                        comp.setComponent_type(c.getComponents().get(i));
                        comp.setOrder(i + 1);
                        TypeData t = new TypeData();
                        t.setData(text.getText().toString());
                        comp.setType_data(t);
                    }
                    else if(c.getComponents().get(i).equals("datetime")) {
                        text = (EditText) ((LinearLayout) lay.getChildAt(i)).getChildAt(1);
                        comp.setComponent_type(c.getComponents().get(i));
                        comp.setOrder(i + 1);
                        TypeData t = new TypeData();
                        SimpleDateFormat parser = new SimpleDateFormat("d-MM-yyy");
                        Date date = null;
                        try {
                            date = parser.parse(text.getText().toString());
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }
                        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss.SXXX");
                        if(date==null) date = new Date();
                        t.setData(simpleDateFormat.format(date).toString());
                        comp.setType_data(t);
                    }
                    clist.add(comp);

                }

                content.setComponents(clist);

                //TODO
                content.setTags(new ArrayList<Tag>());
                sendPost(content);

            }

        });
        lay.addView(b);
        template.addView(lay);


    }

    private void sendPost(Content content) {

        Gson gson = new GsonBuilder().create();

        String json = gson.toJson(content);
        Log.d("JSON",json);
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json);
        hub.getApiService().postContent(groupId,requestBody).enqueue(new Callback<Content>() {
        int imagecounter=0;
            @Override
            public void onResponse(Call<Content> call, Response<Content> response) {

                if(response!=null && response.body()!=null) {
                    Log.d("Post ekleme"," BASARILI ");
                    sendContent = response.body();

                    for(int i=0;i<sendContent.getComponents().size();i++){
                        if(sendContent.getComponents().get(i).getComponent_type().equals("image")){
                            hub.getApiService().updateComponentImage(sendContent.getComponents().get(i).getId(),uploadedimageList.get(imagecounter++)).enqueue(new Callback<Message>() {
                                @Override
                                public void onResponse(Call<Message> call, Response<Message> response) {

                                }

                                @Override
                                public void onFailure(Call<Message> call, Throwable t) {

                                }
                            });
                        }
                    }
                    /*for(int i =0;i<sendContent.getContentType().getComponents().size();i++){
                        if(sendContent.getContentType().getComponents().get(i).equals("image")){
                            if(uploadedimageList.size()<1) return;
                              hub.getApiService().updateComponentImage(sendContent.getComponents().get(i).getId(),uploadedimageList.get(imagecounter++)).enqueue(new Callback<Message>() {
                               @Override
                               public void onResponse(Call<Message> call, Response<Message> response) {


                               }

                               @Override
                               public void onFailure(Call<Message> call, Throwable t) {

                               }
                           });
                        }
                    }*/
                    Intent intent = new Intent(getBaseContext(), GroupActivity.class);
                    intent.putExtra("groupName", groupName);
                    intent.putExtra("groupId", groupId);
                    startActivity(intent);
                }


            }

            @Override
            public void onFailure(Call<Content> call, Throwable t) {
                Log.d("Post ekleme"," BASARISIZ "+t.getMessage());
            }
        });
    }
    public void pickImage() {

        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.INTERNAL_CONTENT_URI);
        intent.setType("image/*");
        startActivityForResult(intent, PICK_PHOTO_FOR_CONTENT);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_PHOTO_FOR_CONTENT && resultCode == Activity.RESULT_OK) {
            if (data == null) {
                //Display an error
                return;
            }

            Uri uri = data.getData();
            String realuri = getRealPathFromURI(uri);

            clickedButton.setText("["+realuri.substring(realuri.lastIndexOf("/")+1)+"]");
            File file = new File(realuri);

            RequestBody requestFile = RequestBody.create(MediaType.parse("multipart/form-data"), file);

            MultipartBody.Part body =
                    MultipartBody.Part.createFormData("file", file.getName(), requestFile);

            uploadedimageList.add(body);

        }
    }

    public String getRealPathFromURI(Uri uri) {
        String[] projection = { MediaStore.Images.Media.DATA };
        @SuppressWarnings("deprecation")
        Cursor cursor = managedQuery(uri, projection, null, null, null);
        int column_index = cursor
                .getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
        cursor.moveToFirst();
        return cursor.getString(column_index);
    }
    public void sendImages(){


    }
    public AlertDialog.Builder createField(final String type, final LinearLayout rowHolder){
        AlertDialog.Builder alertDialog = new AlertDialog.Builder(NewContent.this);
        alertDialog.setTitle("Name for "+type);

        final EditText text = new EditText(NewContent.this);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT);
        text.setLayoutParams(lp);

        alertDialog.setView(text);
        alertDialog.setPositiveButton("Next",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        if(type.equals("Dropdown")){
                            createValues(type,text.getText().toString(),rowHolder).show();
                        }
                        else if(type.equals("Checkbox")){
                            createValues(type,text.getText().toString(),rowHolder).show();
                        }
                        else{

                            names.add(text.getText().toString());
                            fields.add(type.toLowerCase());
                            values.add("");
                            LinearLayout singleRow = (LinearLayout) getLayoutInflater().inflate(R.layout.template_creation_row,null);
                            TextView tt1 = (TextView) singleRow.getChildAt(0);

                            tt1.setText(text.getText().toString());
                            TextView tt2 = (TextView) singleRow.getChildAt(1);

                            tt2.setText(type);
                            rowHolder.addView(singleRow);


                        }
                    }
                });

        alertDialog.setNegativeButton("Cancel",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.cancel();
                    }
                });
        return alertDialog;
    }
    public AlertDialog.Builder createValues(final String type,final String name,final  LinearLayout rowHolder){
        AlertDialog.Builder alertDialog = new AlertDialog.Builder(NewContent.this);
        alertDialog.setTitle("Enter values for "+name+ " (seperate by comma)");

        final EditText text = new EditText(NewContent.this);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT);
        text.setLayoutParams(lp);

        alertDialog.setView(text);
        alertDialog.setPositiveButton("Next",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        names.add(name);
                        fields.add(type.toLowerCase());
                        values.add(text.getText().toString());
                        LinearLayout singleRow = (LinearLayout) getLayoutInflater().inflate(R.layout.template_creation_row_with_value,null);
                        TextView tt1 = (TextView) singleRow.getChildAt(0);
                        tt1.setText(text.getText().toString());

                        TextView tt2 = (TextView) singleRow.getChildAt(2);
                        tt2.setText(type);

                        TextView tt3 = (TextView) singleRow.getChildAt(1);
                        tt3.setGravity(Gravity.CENTER);
                        String vals[] =  text.getText().toString().split(",");
                        String ftext="";
                        for(String vv:vals) ftext+=vv+"\n";
                        tt3.setText(ftext);
                        rowHolder.addView(singleRow);


                    }
                });

        alertDialog.setNegativeButton("Cancel",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.cancel();
                    }
                });
        return alertDialog;
    }

}
